import styles from "./home.module.scss";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { RiHome8Line, RiBookLine, RiUser3Line } from "react-icons/ri";
import Link from "next/link";

import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
import { getToken } from "next-auth/jwt";
import { api } from "../../services/api";

import { DiscoverNewBookCard } from "../../components/DiscoverNewBookCard";
import { CurrentlyReadingCard } from "../../components/CurrentlyReadingCard";

import { DebounceInput } from "react-debounce-input";

interface searchedBook {
  id: string;
  volumeInfo: {
    title: string;
    authors: string;
    imageLinks: {
      thumbnail: string;
    };
  };
}
interface readingNowProps {
  id: string;
  volumeInfo: {
    title: string;
    author: string;
    imageLink: string;
  };
  accessInfo: string;
}

interface recommendedBooksProps {
  id: string;
  volumeInfo: {
    title: string;
    author: string;
    imageLink: string;
  };
  infoLink: string;
}

interface homeProps {
  readingNow: readingNowProps;
  recommendedBooks: recommendedBooksProps[];
}

export default function Home({ readingNow, recommendedBooks }: homeProps) {
  const [session] = useSession();
  const [books, setBooks] = useState<searchedBook[]>([]);
  const filteredResponse = {} as searchedBook[];

  async function handleSearch(search: string) {
    try {
      if (search) {
        const response = await api
          .get(
            `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=9`
          )
          .then((response) => response.data.items);

        if (response) {
          const filteredResponse = response.map((book) => {
            return {
              id: book.id,
              volumeInfo: {
                title: book.volumeInfo.title,
                authors: book.volumeInfo?.authors[0] ?? "Autor não informado",
                imageLinks: {
                  thumbnail:
                    book.volumeInfo.imageLinks?.thumbnail ??
                    "http://books.google.com/books/content?id=rsYpAQAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE71DJBAjHtlFKNu0HX-f-yhay7MASWgrQZ5pItOpwMj9jLIpJ1Kq_OWTv0KWGsajavzEq2oTTtGwiqx_-TTaaLCfnNuaB-5LW-ChHqN3CMgrAA6JsRDtQ8aV6Iz13B7eosRoktkm&source=gbs_api",
                },
              },
            };
          });
          setBooks(filteredResponse);
        }
      } else {
        setBooks([]);
      }
      console.log(books.length);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className={styles.homeContainer}>
      <div className={styles.searchButtonContainer}>
        <label htmlFor="search">
          <BsSearch color="#e1e1e6" fontSize="1.2rem" />
          <DebounceInput
            minLength={2}
            debounceTimeout={600}
            id="search"
            name="search"
            type="text"
            placeholder="Search"
            onChange={(event) => handleSearch(event.target.value)}
          />
        </label>
      </div>
      {books.length >= 1 ? (
        <div className={styles.searchContainer}>
          <div className={styles.searchContent}>
            {books.map((book) => {
              return (
                <Link href={`/details/${book.id}`}>
                  <a className={styles.searchedBookCard}>
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt="Book"
                    />
                    <h1>{book.volumeInfo.title}</h1>
                    <h2>by {book.volumeInfo.authors}</h2>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <h2>
            Hi, <span>{session?.user.name ?? ""}</span>👋
          </h2>
          <div className={styles.homeContent}>
            {recommendedBooks && (
              <div className={styles.discoverNewBooksContainer}>
                <h2>Discover a new book</h2>
                <div className={styles.newBooksContainer}>
                  {recommendedBooks.map((book) => {
                    return <DiscoverNewBookCard bookInfo={book} />;
                  })}
                </div>
              </div>
            )}
            {readingNow && (
              <div className={styles.currentlyReadingContainer}>
                <h2>Currently reading</h2>
                <CurrentlyReadingCard bookInfo={readingNow} />
              </div>
            )}
          </div>
        </>
      )}
      <footer>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <Link href="#">
              <a style={{ color: "#bababb" }}>
                <RiHome8Line fontSize="2rem" />
                Home
              </a>
            </Link>
            <Link href="#">
              <a style={{ color: "#bababb" }}>
                <RiBookLine fontSize="2rem" />
                Libraries
              </a>
            </Link>
            <Link href="#">
              <a style={{ color: "#bababb" }}>
                <RiUser3Line fontSize="2rem" />
                Profile
              </a>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const secret = process.env.SECRET;
  const apiKey = process.env.GOOGLE_API_KEY;
  const session = await getSession({ req });
  const token = await getToken({ req, secret });

  let recommendedBooksData = [{} as readingNowProps];
  let readingNowData = {} as readingNowProps;
  let filteredRecommendedBooks = {};
  let filteredReadingNow = {};
  if (session && token) {
    try {
      recommendedBooksData = await api
        .get(
          `https://www.googleapis.com/books/v1/mylibrary/bookshelves/8/volumes?key=${apiKey}&maxResults=4`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        )
        .then((data) => data.data.items);

      //It's necessary to correct the interface for it to stop showing these errors
      filteredRecommendedBooks = recommendedBooksData.map((book) => {
        return {
          id: book.id,
          volumeInfo: {
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors[0],
            imageLink: book.volumeInfo.imageLinks.thumbnail,
          },
          infoLink: book.volumeInfo.infoLink,
        };
      });
    } catch {
      filteredRecommendedBooks = false;
      console.log("Erro ao obter livros recomendados");
    }

    try {
      readingNowData = await api
        .get(
          `https://www.googleapis.com/books/v1/mylibrary/bookshelves/6/volumes?key=${apiKey}&maxResults=1`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        )
        .then((data) => data.data.items);
      filteredReadingNow = {
        id: readingNowData[0].id,
        volumeInfo: {
          title: readingNowData[0].volumeInfo.title,
          author: readingNowData[0].volumeInfo.authors[0],
          imageLink: readingNowData[0].volumeInfo.imageLinks.thumbnail,
        },
        accessInfo: readingNowData[0].accessInfo.webReaderLink,
      };
    } catch {
      filteredReadingNow = false;
      console.log("Erro ao obter readingNow");
    }
  } else {
    /**
     * It's necessary to create a better way to cope with user's invalid token
     * and session, the correct way is to validate the user's token or he won't be
     * able to make requests to google books api
     */
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      recommendedBooks: filteredRecommendedBooks,
      readingNow: filteredReadingNow,
    },
  };
};
