import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Post from "../components/Post";
import PostSkeleton from "../components/PostSkeleton";
import { UserContext } from "../context/UserContext";
import { BookOpen, Calendar, ArrowLeft, Edit3, X, PenSquare } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { getUserAvatarStyle } from "../utils/avatarColor";

export default function UserProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Profile modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`${process.env.REACT_APP_API_URL}/user/${encodeURIComponent(username)}`)
      .then(async (res) => {
        if (!res.ok) {
          const postsRes = await fetch(`${process.env.REACT_APP_API_URL}/post`);
          if (postsRes.ok) {
            const allPosts = await postsRes.json();
            const userPosts = allPosts.filter(
              (p) => p.author && p.author.username && p.author.username.toLowerCase() === username.toLowerCase()
            );
            if (userPosts.length > 0) {
              const actualAuthor = userPosts[0].author;
              return {
                user: {
                  _id: actualAuthor._id,
                  username: actualAuthor.username,
                  name: "",
                  bio: "Passionate writer & reader on WordHive.",
                  createdAt: new Date(),
                },
                posts: userPosts,
              };
            }
          }
          throw new Error("User not found");
        }
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
        setEditName(data.user.name || "");
        setEditUsername(data.user.username || "");
        setEditBio(data.user.bio || "");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [username]);

  const isOwnProfile = userInfo && profileData && (
    String(userInfo.id) === String(profileData.user._id) ||
    userInfo.username.toLowerCase() === profileData.user.username.toLowerCase()
  );

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: editUsername.trim(),
          name: editName.trim(),
          bio: editBio.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 404) {
          toast.error("Profile endpoint not found on server (re-deploy backend to Vercel)");
        } else {
          toast.error(data.error || "Failed to update profile");
        }
        setIsSaving(false);
        return;
      }

      const data = await res.json();
      toast.success("Profile updated successfully!");
      setUserInfo((prev) => ({
        ...prev,
        username: data.username,
      }));

      setProfileData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          username: data.username,
          name: data.name,
          bio: data.bio,
        },
      }));

      setIsEditing(false);
      setIsSaving(false);

      if (data.username !== username) {
        navigate(`/user/${data.username}`, { replace: true });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Server error.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        <PostSkeleton />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-900">User Not Found</h2>
        <p className="text-slate-500 font-medium max-w-md mx-auto">
          The author profile you are looking for does not exist or has been removed.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm shadow transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stories</span>
          </Link>
        </div>
      </div>
    );
  }

  const { user, posts } = profileData;
  const joinedDate = user.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : null;
  const avatarStyle = getUserAvatarStyle(user.username);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* User Header Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 p-8 sm:p-10 shadow-xl shadow-amber-500/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Alphabetical Color Initial Avatar */}
          <div className={`w-24 h-24 rounded-full ${avatarStyle.palette.bg} ${avatarStyle.palette.text} border-4 border-white shadow-xl flex items-center justify-center font-black text-3xl shrink-0 uppercase tracking-tight`}>
            {avatarStyle.initial}
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {user.name ? user.name : `@${user.username}`}
                </h1>
                {user.name && (
                  <p className="text-sm font-bold text-amber-700">@{user.username}</p>
                )}
                {joinedDate && (
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-semibold text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Member since {joinedDate}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-amber-200 text-amber-900 text-xs font-bold shadow-sm">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>{posts.length} {posts.length === 1 ? 'Article' : 'Articles'}</span>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* User Bio */}
            <p className="text-slate-600 text-base leading-relaxed font-medium max-w-2xl">
              {user.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-amber-200 max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                <span>Edit Profile</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Harsh Deep"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                  required
                  placeholder="username (lowercase only)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="Tell readers about yourself..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm font-medium resize-none"
                />
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles Section Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            <span>Stories by {user.username}</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        {/* User Posts List / Grid with Management Toolbar for Owner */}
        {posts.length > 0 ? (
          <div className="posts-container view-mode-grid">
            {posts.map((post) => (
              <div key={post._id} className="flex flex-col bg-white border border-amber-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="flex-1">
                  <Post {...post} />
                </div>
                {isOwnProfile && (
                  <div className="p-3 bg-amber-50/40 border-t border-amber-100 flex items-center justify-end">
                    <Link
                      to={`/edit/${post._id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-white border border-amber-200 hover:bg-amber-100/70 px-4 py-1.5 rounded-lg shadow-sm transition"
                    >
                      <PenSquare className="w-3.5 h-3.5 text-amber-600" />
                      <span>Edit Story</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/60 border border-dashed border-amber-200 rounded-3xl p-8 space-y-3">
            <p className="text-slate-500 font-medium">
              {user.username} hasn't published any stories yet.
            </p>
            {isOwnProfile && (
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm shadow hover:bg-amber-400 transition"
              >
                <span>Write Your First Story</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
