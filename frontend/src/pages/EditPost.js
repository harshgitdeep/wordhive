import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Editor from "../components/Editor";
import { toast } from "react-hot-toast";
import { Save, Trash2, AlertTriangle, X } from "lucide-react";

function EditPost() {
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState({ title: "", summary: "", content: "" });
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  // Modal Dialog States
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);

  // Check if form is dirty (unsaved changes)
  const isDirty =
    initialData.title !== title ||
    initialData.summary !== summary ||
    initialData.content !== content ||
    (files && files.length > 0);

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
          };
          setInitialData(loadedData);
          setTitle(loadedData.title);
          setSummary(loadedData.summary);
          setContent(loadedData.content);
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
    <>
      <form className="create-post edit-post-form" onSubmit={handleSaveClick}>
        <div className="form-header">
          <h1>Edit Post</h1>
          {isDirty && <span className="unsaved-badge">• Unsaved Changes</span>}
        </div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
        />
        <input
          type="file"
          onChange={(ev) => setFiles(ev.target.files)}
        />
        <Editor onChange={setContent} value={content} />
        <div className="form-action-buttons">
          <button type="submit" className="update-btn">
            <Save className="w-5 h-5" />
            <span>Update Post</span>
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="delete-btn"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Post</span>
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

      {/* Delete Confirmation Modal */}
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
    </>
  );
}

export default EditPost;
