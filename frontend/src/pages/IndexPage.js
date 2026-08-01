import Post from "../components/Post";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Search, Loader2, Users, X, LayoutGrid, List } from "lucide-react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState(() => {
    return typeof window !== "undefined" && window.innerWidth < 1024 ? "list" : "grid";
  });
  const { userInfo } = useContext(UserContext);

  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setViewMode("list");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post`).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
        setIsLoading(false);
      });
    });

    fetch(`${process.env.REACT_APP_API_URL}/total-users`)
      .then((res) => res.json())
      .then((data) => {
        if (data.totalUsers !== undefined) {
          setTotalUsers(data.totalUsers);
        }
      })
      .catch((err) => console.error("Error fetching total users:", err));
  }, []);

  if (isLoading) {
    return (
      <div className="loading-icon">
        <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
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

          {/* Total Users & Stats Display Card */}
          <div className="bg-white/80 backdrop-blur border border-amber-200/70 shadow-xl shadow-amber-500/5 rounded-2xl p-6 max-w-md mx-auto mb-8 flex items-center justify-around">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-3xl font-black text-amber-500">
                <Users className="w-7 h-7 text-amber-500" />
                <span>{totalUsers}</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Registered Writers
              </div>
            </div>
            <div className="h-10 w-px bg-amber-200/60" />
            <div className="text-center">
              <div className="text-3xl font-black text-slate-800">
                {posts.length}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Published Stories
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/create"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 text-white font-bold px-8 py-3.5 shadow-[0_4px_0_0_#b45309] hover:bg-amber-400 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#b45309] active:translate-y-1 active:shadow-[0_1px_0_0_#b45309] transition-all duration-150 text-sm"
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
      <div id="explore-section" className="search-filter-container mb-8">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search stories, ideas or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
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
          <div className="layout-toggle-group">
            <button
              type="button"
              className={`layout-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>
            <button
              type="button"
              className={`layout-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="List View"
            >
              <List size={15} />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div id="articles" className="w-full scroll-mt-28">
        {filteredAndSortedPosts.length > 0 ? (
          <div className={`posts-container ${viewMode === 'list' ? 'view-mode-list' : 'view-mode-grid'}`}>
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
