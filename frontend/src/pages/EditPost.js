import { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Editor from "../Editor";
import { toast } from "react-hot-toast";
import { Save, Trash2 } from "lucide-react";

function EditPost() {
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/post/${id}`,
        );
        if (response.ok) {
          const post = await response.json();
          setTitle(post.title);
          setSummary(post.summary);
          setContent(post.content);
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

  async function updatePost(ev) {
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

    const data = { title, summary, content };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/post/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );
      if (response.ok) {
        toast.success("Post updated successfully!");
        setRedirect(true);
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to update post:",
          response.status,
          response.statusText,
          errorText,
        );
        toast.error("Failed to update post. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Failed to update post. Please try again later.");
    }
  }

  async function deletePost() {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/post/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (response.ok) {
        toast.success("Post deleted successfully!");
        setRedirect(true);
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to delete post:",
          response.status,
          response.statusText,
          errorText,
        );
        toast.error("Failed to delete post. Please try again later.");
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
    <form className="create-post edit-post-form" onSubmit={updatePost}>
      <h1>Edit Post</h1>
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
      <Editor onChange={setContent} value={content} />
      <div className="form-action-buttons">
        <button type="submit" className="update-btn">
          <Save className="w-5 h-5" />
          <span>Update Post</span>
        </button>
        <button
          type="button"
          onClick={deletePost}
          className="delete-btn"
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete Post</span>
        </button>
      </div>
    </form>
  );
}

export default EditPost;
