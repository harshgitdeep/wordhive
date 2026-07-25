import { format } from "date-fns";
import { Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="placeholder-icon">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
              <path d="M12 22V12" />
              <path d="M12 12L2 7" />
              <path d="M12 12l10-5" />
              <circle cx="12" cy="12" r="2" fill="#FBBF24" />
            </svg>
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
