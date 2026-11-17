import { useState } from "react";
import { Link } from "react-router-dom";
import { excerpt, postImage, themeFor } from "../api";
import Cover from "./Cover";

// variant="list": minimal list with small thumbnails
// variant="grid": image cards (Home and Blog pages)
// editable: shows Edit and Delete buttons on each post
// onDelete(post): called after the user confirms; should return a promise
const PostList = ({ posts, variant = "list", editable = false, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (post) => {
    const ok = window.confirm(`Delete “${post.title}”?\n\nThis cannot be undone.`);
    if (!ok || !onDelete) return;
    setDeletingId(post.id);
    try {
      await onDelete(post);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ul className={variant === "grid" ? "post-grid" : "post-list"}>
      {posts.map((post) => (
        <li key={post.id} className={`post-item ${themeFor(post.id)}`}>
          <Link to={`/blog/${post.id}`}>
            <Cover
              src={variant === "grid" ? postImage(post, 600, 360) : postImage(post, 240, 240)}
              theme={themeFor(post.id)}
              className="post-thumb"
            />
            <div className="post-text">
              <h3>{post.title}</h3>
              <p>{excerpt(post.post, variant === "grid" ? 110 : 160)}</p>
              <span className="read-more">Read more →</span>
            </div>
          </Link>
          {editable && (
            <div className="post-actions">
              <Link
                to={`/edit/${post.id}`}
                className="post-action post-edit"
                aria-label={`Edit “${post.title}”`}
              >
                Edit
              </Link>
              <button
                type="button"
                className="post-action post-delete"
                onClick={() => handleDelete(post)}
                disabled={deletingId === post.id}
                aria-label={`Delete “${post.title}”`}
              >
                {deletingId === post.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default PostList;
