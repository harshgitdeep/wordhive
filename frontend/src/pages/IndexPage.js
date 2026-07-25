import Post from "../Post";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Search } from "lucide-react";
import HomeGif from "./homeloading.gif";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post`).then((response) => {
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

  const filteredAndSortedPosts = posts
    .filter((post) => {
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  return (
    <div className="w-full py-6">
      {/* SaaS Hero Section (Visible only when user is not logged in) */}
      {!userInfo?.username && (
        <section className="text-center py-16 px-4 max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-amber-700 bg-amber-50/60 rounded-full border border-amber-200/50 uppercase">
            🐝 Swarm intelligence for ideas
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
            Where Ideas Swarm.<br />
            <span className="text-amber-500">Stories Become Honey.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            WordHive is the modern publishing platform where creators write, share, and organize knowledge inside a thriving digital hive.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/create"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold px-8 py-3.5 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              Start Writing 🐝
            </a>
            <a
              href="#articles"
              className="inline-flex items-center justify-center rounded-xl bg-white border border-amber-200 text-amber-700 font-bold px-8 py-3.5 hover:bg-amber-50/50 transition transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              Explore Articles
            </a>
          </div>
        </section>
      )}

      {/* Search & Filter Row */}
      <div className="search-filter-row mb-8">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search stories, ideas or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Articles Section */}
      <div id="articles" className="w-full scroll-mt-28">
        {filteredAndSortedPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedPosts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border bg-white border-amber-100 p-12 text-center shadow-sm max-w-2xl mx-auto">
            <div className="text-4xl mb-4">🍯</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No posts found</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              No matching honey matches your search inside the hive...<br />
              Try adjusting your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
              }}
              className="secondary-btn rounded-xl py-3 px-6 text-sm font-bold inline-block w-auto"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
