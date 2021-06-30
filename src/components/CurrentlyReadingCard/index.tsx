import Link from "next/link";
import { RiBookMarkLine } from "react-icons/ri";
import ovalImage2 from "../../assets/oval2.png";
import rectangleImage from "../../assets/rectangle.png";
import smallOvalImage from "../../assets/smallOval.png";
import Image from "next/image";
import styles from "./styles.module.scss";
interface CurrentlyReadingCardProps {
  bookInfo: {
    id: string;
    volumeInfo: {
      title: string;
      author: string;
      imageLink: string;
    };
    accessInfo: string;
  };
}
export function CurrentlyReadingCard({ bookInfo }: CurrentlyReadingCardProps) {
  return (
    <Link href={`/details/${bookInfo.id}`}>
      <a className={styles.cardCurrentlyReading}>
        <span className={styles.currentlyBookImage}>
          <img src={bookInfo.volumeInfo.imageLink} />
        </span>

        <span className={styles.currentlyReadingInfos}>
          <h2>{bookInfo.volumeInfo.title}</h2>
          <h3>by {bookInfo.volumeInfo.author}</h3>
          <h4>
            <RiBookMarkLine color="purple" fontSize="1rem" />
            Chapter<span>2 </span>From 9
          </h4>
        </span>
        <span className={styles.decorationImages}>
          <span>
            <Image src={ovalImage2} />
          </span>
          <span>
            <Image src={rectangleImage} />
          </span>
          <span>
            <Image src={smallOvalImage} />
          </span>
        </span>
      </a>
    </Link>
  );
}
