import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.scss";
import bookImage from "../../assets/book.jpg";
import ovalImage from "../../assets/oval.png";
import { RiBarChartBoxLine } from "react-icons/ri";
import { Url } from "url";
interface discoverNewBooksProps {
  bookInfo: {
    id: string;
    volumeInfo: {
      title: string;
      author: string;
      imageLink: string;
    };
    infoLink: string;
  };
}
export function DiscoverNewBookCard({ bookInfo }: discoverNewBooksProps) {
  return (
    <Link href={`/details/${bookInfo.id}`}>
      <a className={styles.bookCard}>
        <span className={styles.ovalImage}>
          <Image src={ovalImage} width={180} height={200} />
        </span>

        <span className={styles.bookInfos}>
          <h2>{bookInfo.volumeInfo.title}</h2>
          <h3>{bookInfo.volumeInfo.author}</h3>
          <h4>
            <RiBarChartBoxLine fontSize="1.3rem" />
            <span>120+</span> Read Now
          </h4>
        </span>
        <span className={styles.bookImage}>
          <img src={bookInfo.volumeInfo.imageLink} />
        </span>
      </a>
    </Link>
  );
}
