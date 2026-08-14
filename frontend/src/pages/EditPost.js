import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { useParams, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Editor from "../components/Editor";
import { toast } from "react-hot-toast";
import { Save, Trash2, AlertTriangle, X, Image as ImageIcon, Edit2, RotateCcw } from "lucide-react";

function EditPost() {
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [initialData, setInitialData] = useState({ title: "", summary: "", content: "", cover: "" });
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [files, setFiles] = useState("");
  const [newPreviewUrl, setNewPreviewUrl] = useState("");
  const [redirect, setRedirect] = useState(false);

  // Modal Dialog States
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageDeleteModal, setShowImageDeleteModal] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);

  // Check if form is dirty (unsaved changes)
  const isDirty =
    initialData.title !== title ||
    initialData.summary !== summary ||
    initialData.content !== content ||
    (files && files.length > 0) ||
    cover !== initialData.cover;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/post/${id}`,
        );
        if (response.ok) {
          const post = await response.json();
          const loadedData = {
            title: post.title || "",
            summary: post.summary || "",
            content: post.content || "",
            cover: post.cover || "",
          };
          setInitialData(loadedData);
          setTitle(loadedData.title);
          setSummary(loadedData.summary);
          setContent(loadedData.content);
          setCover(loadedData.cover);
        } else {
          console.error(
            "Failed to fetch post:",
            response.status,
            response.statusText,
          );
          toast.error("Failed to fetch post. Please try again later.");
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        toast.error("Failed to fetch post. Please try again later.");
      }
    };

    fetchPost();
  }, [id]);

  // Handle browser reload/close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Intercept inner app link clicks when form has unsaved changes
  const handleDocumentClick = useCallback(
    (e) => {
      if (!isDirty) return;

      const anchor = e.target.closest("a");
      if (anchor && anchor.href) {
        const targetUrl = new URL(anchor.href, window.location.origin);
        // Check if internal navigation link
        if (targetUrl.origin === window.location.origin) {
          const targetPath = targetUrl.pathname + targetUrl.search + targetUrl.hash;
          if (targetPath !== location.pathname) {
            e.preventDefault();
            e.stopPropagation();
            setPendingLocation(targetPath);
          }
        }
      }
    },
    [isDirty, location.pathname]
  );

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [handleDocumentClick]);

  function handleSaveClick(ev) {
    ev.preventDefault();

    if (!title) {
      toast.error("Please enter a title.");
      return;
    }
    if (!summary) {
      toast.error("Please enter a summary.");
      return;
    }
    if (!content) {
      toast.error("Please enter some content.");
      return;
    }

    setShowSaveModal(true);
  }

  async function confirmSavePost() {
    setShowSaveModal(false);

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files?.[0]) {
      data.set("file", files[0]);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/post/${id}`,
        {
          method: "PUT",
          body: data,
          credentials: "include",
        },
      );
      if (response.ok) {
        setInitialData({ title, summary, content });
        toast.success("Post updated successfully!");
        setRedirect(true);
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.error(
          "Failed to update post:",
          response.status,
          response.statusText,
          errJson,
        );
        toast.error(errJson.error || "Failed to update post. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Failed to update post. Please try again later.");
    }
  }

  async function confirmDeletePost() {
    setShowDeleteModal(false);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/post/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (response.ok) {
        setInitialData({ title, summary, content });
        toast.success("Post deleted successfully!");
        setRedirect(true);
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.error(
          "Failed to delete post:",
          response.status,
          response.statusText,
          errJson,
        );
        toast.error(errJson.error || errJson.message || "Failed to delete post. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post. Please try again later.");
    }
  }

  if (userInfo === null) {
    return <Navigate to="/login" />;
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Bar: Left-aligned title & Right-aligned compact Delete button */}
      <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-amber-200/60">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Edit Story
        </h1>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          style={{ width: "auto" }}
          className="inline-flex items-center gap-1.5 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer shrink-0"
          title="Delete Story"
        >
          <Trash2 className="w-3.5 h-3.5 text-white" />
          <span>Delete Story</span>
        </button>
      </div>

      {/* Main Article Editor Canvas */}
      <form onSubmit={handleSaveClick} className="space-y-6">
        {/* Story Title Input */}
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Article Title
          </label>
          <input
            type="text"
            placeholder="Title of your story..."
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className="w-full text-2xl sm:text-4xl font-black text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-amber-500 outline-none py-2 transition placeholder:text-slate-300 tracking-tight"
          />
        </div>

        {/* Story Summary Input */}
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Story Summary & Subtitle
          </label>
          <input
            type="text"
            placeholder="A brief catchy summary to introduce your post..."
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
            className="w-full text-base sm:text-lg font-medium text-slate-600 bg-transparent border-b border-slate-200 focus:border-amber-500 outline-none py-2 transition placeholder:text-slate-300"
          />
        </div>

        {/* Cover Photo Upload & Preview Card */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Cover Image
          </label>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(ev) => {
              const selectedFile = ev.target.files?.[0];
              if (selectedFile) {
                setFiles(ev.target.files);
                setNewPreviewUrl(URL.createObjectURL(selectedFile));
              }
            }}
          />

          {newPreviewUrl || cover ? (
            /* Active Image Preview Box with On-Image Overlay Actions */
            <div className="relative group rounded-2xl overflow-hidden border border-amber-200/80 bg-slate-900 shadow-md max-h-96 flex items-center justify-center">
              <img
                src={newPreviewUrl || cover}
                alt="Cover Preview"
                className="w-full max-h-96 object-cover transition-transform duration-300 group-hover:scale-105 opacity-95 group-hover:opacity-100"
              />

              {/* Top-Right Badge */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                {newPreviewUrl ? "New Image Selected" : "Current Cover Image"}
              </div>

              {/* On-Image Action Buttons Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end sm:items-center justify-center p-3 sm:p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 gap-2 sm:gap-3">
                {/* Edit / Change Image Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: "auto" }}
                  className="inline-flex items-center justify-center gap-1.5 p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow-lg transition active:scale-95 shrink-0"
                  title="Change Image"
                >
                  <Edit2 className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">Change Image</span>
                </button>

                {/* Discard / Revert Button */}
                {newPreviewUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFiles("");
                      setNewPreviewUrl("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    style={{ width: "auto" }}
                    className="inline-flex items-center justify-center gap-1.5 p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-bold text-xs shadow-lg backdrop-blur-md transition active:scale-95 shrink-0"
                    title="Discard New Image"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-700" />
                    <span className="hidden sm:inline">Discard New Image</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowImageDeleteModal(true)}
                    style={{ width: "auto" }}
                    className="inline-flex items-center justify-center gap-1.5 p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs shadow-lg backdrop-blur-md transition active:scale-95 shrink-0"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Remove Image</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Upload Dropzone Empty State */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative rounded-2xl border-2 border-dashed border-amber-200/80 bg-amber-50/30 p-8 text-center hover:border-amber-400 transition cursor-pointer space-y-2 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800">
                Upload Cover Photo
              </div>
              <p className="text-xs text-slate-500">
                Click to browse or choose an image for your article cover
              </p>
            </div>
          )}
        </div>

        {/* WYSIWYG Content Editor Canvas */}
        <div className="space-y-2 pt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Article Body Content
          </label>
          <div className="editorial-canvas-wrapper rounded-2xl border border-amber-200/80 bg-white shadow-sm overflow-hidden">
            <Editor onChange={setContent} value={content} />
          </div>
        </div>

        {/* Bottom Publish Actions Bar */}
        <div className="pt-6 border-t border-amber-200/60 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-base shadow-lg shadow-amber-500/25 transition active:scale-95 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>Publish Changes</span>
          </button>
        </div>
      </form>

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowSaveModal(false)}>
              <X className="w-5 h-5" />
            </button>
            <div className="modal-icon warning" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
              <Save className="w-8 h-8" />
            </div>
            <h2>Save Changes?</h2>
            <p>Are you sure you want to save the changes made to this post?</p>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowSaveModal(false)}>
                Cancel
              </button>
              <button className="update-btn" style={{ flex: 1, padding: "11px 18px" }} onClick={confirmSavePost}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Post Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowDeleteModal(false)}>
              <X className="w-5 h-5" />
            </button>
            <div className="modal-icon danger">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2>Delete Post?</h2>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="danger-btn" onClick={confirmDeletePost}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Cover Image Confirmation Modal */}
      {showImageDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowImageDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowImageDeleteModal(false)}>
              <X className="w-5 h-5" />
            </button>
            <div className="modal-icon danger">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h2>Remove Cover Image?</h2>
            <p>Are you sure you want to remove the cover photo from this article?</p>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowImageDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="danger-btn"
                onClick={() => {
                  setCover("");
                  setFiles("");
                  setNewPreviewUrl("");
                  setShowImageDeleteModal(false);
                  toast.success("Cover image removed");
                }}
              >
                Remove Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Navigation Modal */}
      {pendingLocation && (
        <div className="modal-overlay" onClick={() => setPendingLocation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setPendingLocation(null)}>
              <X className="w-5 h-5" />
            </button>
            <div className="modal-icon warning">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2>Unsaved Changes</h2>
            <p>You have unsaved changes in this post. Are you sure you want to leave without saving?</p>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setPendingLocation(null)}>
                Stay on Page
              </button>
              <button
                className="warning-btn"
                onClick={() => {
                  const target = pendingLocation;
                  setPendingLocation(null);
                  navigate(target);
                }}
              >
                Leave Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPost;
