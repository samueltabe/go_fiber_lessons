import { useEffect, useState } from "react";
import { deletePost, getPosts } from "../api";
import PostList from "../components/PostList";
import Spinner from "../components/Spinner";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err) => {
        console.log(err.response);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (post) => {
    setDeleteError("");
    try {
      await deletePost(post.id);
      setPosts((current) => current.filter((p) => p.id !== post.id));
    } catch (err) {
      setDeleteError(err?.response?.data?.msg || `Could not delete “${post.title}”. Please try again.`);
    }
  };

  return (
    <section className="container section">
      <h1 className="page-title">Blog</h1>
      {loading && <Spinner label="Loading posts…" />}
      {error && <p className="error">Could not load posts. Is the API running?</p>}
      {!loading && !error && (
        <>
          <p className="muted">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </p>
          {deleteError && <p className="error" role="alert">{deleteError}</p>}
          <PostList posts={posts} variant="grid" editable onDelete={handleDelete} />
        </>
      )}
    </section>
  );
};

export default Blog;
