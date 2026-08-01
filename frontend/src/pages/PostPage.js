import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { Loader2, Share2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setTimeout(() => {
          setPostInfo(postInfo);
          setIsLoading(false);
        }, 2000);
      });
    });
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: postInfo.title,
      text: postInfo.summary || `Check out this blog post: ${postInfo.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-icon">
        <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
      </div>
    );
  }

  if (!postInfo) return null;

  const formattedDate = format(new Date(postInfo.createdAt), "MMMM dd, yyyy");

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formattedDate}</time>
      <div className="author">@{postInfo.author.username}</div>
      <div className="action-row">
        <button className="share-btn" onClick={handleShare} aria-label="Share post">
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? "Link Copied!" : "Share"}</span>
        </button>
        {userInfo && userInfo.id === postInfo.author._id && (
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit this post
          </Link>
        )}
      </div>
      {postInfo.cover && (
        <div className="image">
          <img
            src={`${postInfo.cover}`}
            alt=""
          />
        </div>
      )}

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
