import { format } from "date-fns";
import { Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ImageOff } from 'lucide-react';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Post({_id, title, summary, cover, content, createdAt, author}) {
  const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");

  return (
    <Link to={`/post/${_id}`} className="post" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="image">
        {cover ? (
          <LazyLoadImage
            src={cover}
            alt={title}
            effect="blur"
          />
        ) : (
          <div className="image-placeholder">
            <ImageOff className="placeholder-icon" />
            <span className="no-image-text">No Image</span>
          </div>
        )}
      </div>
      <div className="texts">
        <div>
          <h2>{title}</h2>
          <p className="summary">{summary}</p>
        </div>
        <p className="info">
          <span className="author">@{author.username}</span>
          <time>{formattedDate}</time>
        </p>
      </div>
    </Link>
  );
}
