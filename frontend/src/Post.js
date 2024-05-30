import { format } from "date-fns";
import { Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Post({_id, title, summary, cover, content, createdAt, author}) {
  const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
        <LazyLoadImage
        src={cover}
        alt="image"
        effect="blur"
        // delayTime={500}
      />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">@{author.username}</a>
          <time>{formattedDate}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
