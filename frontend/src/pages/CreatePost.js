import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import loadingGif from "./loading.gif";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const TITLE_MAX_LENGTH = 80;
  const SUMMARY_MAX_LENGTH = 80;

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);

    if (!files[0]) {
      data.set("file", "");
    } else {
      data.set("file", files[0]);
    }

    ev.preventDefault();

    setIsLoading(true); // Set loading to true before fetch
    const response = await fetch("https://wordhive-backend.vercel.app/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    setIsLoading(false); // Set loading to false after fetch
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (isLoading) {
    return (
      <div className="loading-icon">
        <img src={loadingGif} style={{ border: "none" }} alt="Loading..." />
      </div>
    );
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

return (
  <section className="min-h-screen bg-white px-6 py-12">
    <div className="max-w-4xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1 mb-5 text-sm font-medium tracking-wide text-yellow-700 bg-yellow-100 rounded-full">
          ✍️ Create New Post
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Share Your Story
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Publish your thoughts, ideas, and experiences with the WordHive
          community.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
        <form onSubmit={createNewPost} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Title
            </label>

            <input
              type="text"
              placeholder="Enter your post title"
              value={title}
              onChange={(ev) => {
                if (ev.target.value.length <= TITLE_MAX_LENGTH) {
                  setTitle(ev.target.value);
                }
              }}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
            />

            <div className="mt-2 text-right text-sm text-gray-400">
              {title.length}/{TITLE_MAX_LENGTH}
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>

            <input
              type="text"
              placeholder="Write a short summary"
              value={summary}
              onChange={(ev) => {
                if (ev.target.value.length <= SUMMARY_MAX_LENGTH) {
                  setSummary(ev.target.value);
                }
              }}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
            />

            <div className="mt-2 text-right text-sm text-gray-400">
              {summary.length}/{SUMMARY_MAX_LENGTH}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Cover Image
            </label>

            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-yellow-300 transition">
              <input
                type="file"
                onChange={(ev) => setFiles(ev.target.files)}
                className="w-full text-sm text-gray-500
                  file:mr-4
                  file:rounded-xl
                  file:border-0
                  file:bg-yellow-100
                  file:px-4
                  file:py-2
                  file:text-sm
                  file:font-medium
                  file:text-yellow-800
                  hover:file:bg-yellow-200"
              />

              <p className="mt-3 text-sm text-gray-400">
                PNG, JPG or JPEG recommended
              </p>
            </div>
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content
            </label>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <Editor value={content} onChange={setContent} />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-gray-900 py-3 font-semibold text-white transition hover:bg-black"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  </section>
);
}
