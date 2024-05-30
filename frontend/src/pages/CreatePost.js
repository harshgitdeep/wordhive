import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import loadingGif from './loading.gif';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const TITLE_MAX_LENGTH = 80;
  const SUMMARY_MAX_LENGTH = 80;

  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);

    if (!files[0]) {
      data.set('file', '');
    } else {
      data.set('file', files[0]);
    }
    

    ev.preventDefault();

    setIsLoading(true); // Set loading to true before fetch
    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    setIsLoading(false); // Set loading to false after fetch
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (isLoading) {
    return (
      <div className="loading-icon">
        <img src={loadingGif} style={{border: "none"}} alt="Loading..." />
      </div>
    ); 
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder={'Title'}
        value={title}
        onChange={(ev) => {
          if (ev.target.value.length <= TITLE_MAX_LENGTH) {
            setTitle(ev.target.value);
          }
        }}
      />
      <input
        type="text"
        placeholder={'Summary'}
        value={summary}
        onChange={(ev) => {
          if (ev.target.value.length <= SUMMARY_MAX_LENGTH) {
            setSummary(ev.target.value);
          }
        }}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: '5px' }}>Create post</button>
    </form>
  );
}
