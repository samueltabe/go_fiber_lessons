import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost, postImage, themeFor } from "../api";
import Cover from "../components/Cover";
import Spinner from "../components/Spinner";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPost(id)
      .then(setPost)
      .catch((error) => console.log(error.response))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <article className="container section narrow">
      <Link to="/blog" className="back-link">← Back to blog</Link>
      {loading ? (
        <Spinner label="Loading post…" />
      ) : post ? (
        <>
          <Cover
            src={postImage(post, 1200, 600)}
            alt=""
            theme={themeFor(post.id)}
            className="post-cover"
          />
          <h1 className="page-title">{post.title}</h1>
          <div className="prose post-body">{post.post}</div>
        </>
      ) : (
        <p className="error">Post not found.</p>
      )}
    </article>
  );
};

export default BlogDetail;
