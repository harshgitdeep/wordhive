import './styles/App.css';
import './styles/Scrollbar.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {UserContextProvider} from "./context/UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import AboutUs from "./pages/AboutUs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFoundPage from "./pages/NotFoundPage";
import { Toaster } from 'react-hot-toast';
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <UserContextProvider>
      <ScrollToTop />
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          top: '85px',
          right: '24px',
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 3500,
          style: {
            background: '#ffffff',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            borderLeft: '4px solid #f59e0b',
            color: '#0f172a',
            fontSize: '0.875rem',
            fontWeight: '600',
            padding: '12px 18px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
            letterSpacing: '-0.01em',
            maxWidth: '360px',
          },
          success: {
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '4px solid #f59e0b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '4px solid #ef4444',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;