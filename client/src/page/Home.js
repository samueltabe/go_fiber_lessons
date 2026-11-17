import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts, imageFor } from "../api";
import PostList from "../components/PostList";
import Spinner from "../components/Spinner";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((error) => console.log(error.response))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section
        className="hero"
        style={{ backgroundImage: `url(${imageFor("hero", 1600, 900)})` }}
      >
        <div className="container hero-inner">
          <p className="eyebrow">Welcome</p>
          <h1>Thoughts, notes and stories.</h1>
          <p className="lead">
            A simple blog powered by a React front end and a Go Fiber API.
          </p>
          <div className="hero-actions">
            <Link to="/blog" className="btn btn-light">Read the blog</Link>
            <Link to="/about" className="btn btn-outline-light">About</Link>
            <Link to="/add" className="btn btn-outline-light">Add Post</Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Latest posts</h2>
          <Link to="/blog">View all →</Link>
        </div>
        {loading ? (
          <Spinner label="Loading posts…" />
        ) : posts.length ? (
          <PostList posts={posts.slice(0, 3)} variant="grid" />
        ) : (
          <p className="muted">No posts yet.</p>
        )}
      </section>

      <section className="container section">
        <div className="cta">
          <div>
            <h2>Got something to say?</h2>
            <p>Questions, ideas for posts or just a hello. I'd love to hear from you.</p>
          </div>
          <Link to="/contact" className="btn btn-light">Get in touch</Link>
        </div>
      </section>
    </>
  );
};

export default Home;
