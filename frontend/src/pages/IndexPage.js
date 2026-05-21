import Post from "../Post";
import { useEffect, useState } from "react";
import HomeGif from "./homeloading.gif";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://wordhive-backend.vercel.app/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
        setIsLoading(false); // Set loading to false when data is loaded
      });
    });
  }, []);

  if (isLoading) {
    return (
      <div className="loading-icon">
        <img
          className="loading-img"
          src={HomeGif}
          alt="Loading..."
          style={{ border: "none" }}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {posts.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {posts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border bg-white border-slate-20 p-8 text-center shadow-sm">
            <p className="mb-6 text-lg leading-8 text-slate-600">
              There are currently no blog posts available.
              <br />
              Create the first post to share your ideas with the community.
            </p>
            <a
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-yellow-100 px-6 py-3 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-200"
            >
              Create Post
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
