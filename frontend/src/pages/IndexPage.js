import Post from "../Post";
import { useEffect, useState } from "react";
import loadingGif from './loading.gif';
import HomeGif from './homeloading.gif';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetch('http://localhost:4000/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
        setIsLoading(false); // Set loading to false when data is loaded
      });
    });
  }, []);
  
  if (isLoading) {
    return <div className="loading-icon">
    <img className="loading-img" src={HomeGif} alt="Loading..." style={{ border: "none" }} />
  </div>
  
  }

  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post key={post.id} {...post} />
      ))}
    </>
  );
}
