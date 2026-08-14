import Post from "../components/Post";
import PostSkeleton from "../components/PostSkeleton";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Search, Users, X, LayoutGrid, List, Sparkles, PenTool, BookOpen, ArrowRight, TrendingUp } from "lucide-react";

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
  const [isUsersLoading, setIsUsersLoading] = useState(true);

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
        setIsUsersLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching total users:", err);
        setIsUsersLoading(false);
      });
  }, []);

  // We handle loading state gracefully inside the render tree with Skeleton Loaders

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
    <div className="w-full py-4">
      {/* SaaS Hero Section (Visible only when user is not logged in) */}
      {!userInfo?.username && (
        <section className="relative overflow-hidden mb-16 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/60 p-8 sm:p-12 md:p-16 shadow-xl shadow-amber-500/5 text-center">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/70 text-amber-900 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>A Place to Write & Share</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Share Your Stories. <br />
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 bg-clip-text text-transparent">
                Read Great Blogs.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
              WordHive is a simple and clean blogging platform. Write your articles, share your thoughts, and discover inspiring posts from writers everywhere.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
              <a
                href="/create"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3.5 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-base"
              >
                <PenTool className="w-5 h-5" />
                <span>Start Writing</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#explore-section"
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-amber-200 hover:border-amber-300 text-slate-700 font-bold px-7 py-3.5 shadow-sm transition hover:bg-amber-50/50 text-base"
              >
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>Read Blogs</span>
              </a>
            </div>

            {/* Simple Metrics Bar (Shown only when loaded) */}
            {(!isUsersLoading || !isLoading) && (
              <div className="pt-6 border-t border-amber-200/50 flex flex-wrap justify-center items-center gap-8 text-slate-600">
                {!isUsersLoading && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-300/40 flex items-center justify-center text-amber-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-black text-slate-900 leading-none">{totalUsers}</div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Writers</div>
                    </div>
                  </div>
                )}

                {!isUsersLoading && !isLoading && (
                  <div className="h-8 w-px bg-amber-200/60 hidden sm:block" />
                )}

                {!isLoading && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-300/40 flex items-center justify-center text-amber-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-black text-slate-900 leading-none">{posts.length}</div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Published Articles</div>
                    </div>
                  </div>
                )}
              </div>
            )}
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
        {isLoading ? (
          <div className={`posts-container ${viewMode === 'list' ? 'view-mode-list' : 'view-mode-grid'}`}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <PostSkeleton key={idx} viewMode={viewMode} />
            ))}
          </div>
        ) : filteredAndSortedPosts.length > 0 ? (
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
