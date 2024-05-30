import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Editor from "../Editor";

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:4000/post/${id}`);
        if (response.ok) {
          const post = await response.json();
          setTitle(post.title);
          setSummary(post.summary);
          setContent(post.content);
        } else {
          console.error("Failed to fetch post:", response.status, response.statusText);
          alert("Failed to fetch post. Please try again later.");
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        alert("Failed to fetch post. Please try again later.");
      }
    };

    fetchPost();
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = { title, summary, content };
  
    try {
      const response = await fetch(`http://localhost:4000/post/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (response.ok) {
        setRedirect(true);
      } else {
        const errorText = await response.text();
        console.error("Failed to update post:", response.status, response.statusText, errorText);
        alert("Failed to update post. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("Failed to update post. Please try again later.");
    }
  }
  
  async function deletePost() {
    try {
      const response = await fetch(`http://localhost:4000/post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setRedirect(true);
      } else {
        const errorText = await response.text();
        console.error("Failed to delete post:", response.status, response.statusText, errorText);
        alert("Failed to delete post. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Please try again later.");
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={updatePost}>
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
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px", marginRight: "10px" }}>Update post</button>
      <button
        type="button"
        onClick={deletePost}
        style={{ marginTop: "5px", color: "white", border: "none", background: "maroon" }}
      >
        Delete post
      </button>
    </form>
  );
}

export default EditPost;
