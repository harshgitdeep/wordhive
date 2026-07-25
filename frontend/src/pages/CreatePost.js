import "react-quill/dist/quill.snow.css";
import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Editor from "../Editor";
import loadingGif from "./loading.gif";

export default function CreatePost() {
  const { userInfo } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (userInfo === null) {
    return <Navigate to="/login" />;
  }

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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
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
    <section className="min-h-screen bg-transparent px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 mb-5 text-xs font-semibold tracking-wide text-amber-700 bg-amber-50/60 rounded-full border border-amber-200/50">
            🐝 Create New Story
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Add to the Hive
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Publish your thoughts, ideas, and experiences with the WordHive community.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-amber-100 rounded-3xl shadow-sm p-8">
          <form onSubmit={createNewPost} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full rounded-2xl border border-amber-100 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 bg-amber-50/20"
              />

              <div className="mt-2 text-right text-sm text-slate-400">
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

            <div className="overflow-hidden rounded-2xl border border-amber-100">
              <Editor value={content} onChange={setContent} />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 font-semibold text-white transition hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-500/20"
          >
            🐝 Create New Story
          </button>
        </form>
      </div>
    </div>
  </section>
);
}
