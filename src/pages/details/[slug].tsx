import styles from "./styles.module.scss";
import Image from "next/image";
import ovalImg from "../../assets/oval2.png";
import bookImage from "../../assets/book.jpg";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiBookOpenLine,
  RiHeadphoneFill,
  RiShareForward2Fill,
} from "react-icons/ri";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { api } from "../../services/api";

interface bookProps {
  volumeInfo: {
    title: string;
    authors: string;
    description: string;
    imageLinks: {
      thumbnail: string;
    };
  };
  accessInfo: {
    webReaderLink: string;
  };
}
export default function Details({ volumeInfo, accessInfo }: bookProps) {
  return (
    <div className={styles.detailsContainer}>
      <div className={styles.background}>
        <span>
          <Image src={ovalImg}></Image>
        </span>
      </div>
      <div className={styles.contentContainer}>
        <Link href="/home">
          <a>
            <RiArrowLeftLine fontSize="1.5rem" />
          </a>
        </Link>

        <div className={styles.bookImage}>
          <img src={volumeInfo.imageLinks.thumbnail} />
        </div>

        <h1>{volumeInfo.title}</h1>
        <h3>{volumeInfo.authors}</h3>
        <p>{volumeInfo.description}</p>

        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <Link href="#">
              <a target="_blank" href={accessInfo.webReaderLink}>
                <RiBookOpenLine color="#666565" />
                Read
              </a>
            </Link>
            <Link href="#">
              <a>
                <RiHeadphoneFill color="#666565" />
                Listen
              </a>
            </Link>
            <Link href="#">
              <a>
                <RiShareForward2Fill color="#666565" />
                Share
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  const { slug } = params;

  let bookData = {} as bookProps;
  let filteredBook = {} as bookProps;

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (session) {
    bookData = await api
      .get(`https://www.googleapis.com/books/v1/volumes/${slug}`)
      .then((data) => data.data);

    filteredBook = {
      volumeInfo: {
        title: bookData.volumeInfo.title,
        authors: bookData.volumeInfo?.authors[0] ?? "Autor não informado",
        description:
          bookData.volumeInfo?.description ??
          "Este livro não possui descrição 😪",
        imageLinks: {
          thumbnail:
            bookData.volumeInfo.imageLinks?.thumbnail ??
            "http://books.google.com/books/content?id=rsYpAQAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE71DJBAjHtlFKNu0HX-f-yhay7MASWgrQZ5pItOpwMj9jLIpJ1Kq_OWTv0KWGsajavzEq2oTTtGwiqx_-TTaaLCfnNuaB-5LW-ChHqN3CMgrAA6JsRDtQ8aV6Iz13B7eosRoktkm&source=gbs_api",
        },
      },
      accessInfo: {
        webReaderLink: bookData.accessInfo.webReaderLink,
      },
    };
  }

  return {
    props: {
      volumeInfo: filteredBook.volumeInfo,
      accessInfo: filteredBook.accessInfo,
    },
  };
};
