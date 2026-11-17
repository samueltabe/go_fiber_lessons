import axios from "axios";

const API_ROOT = process.env.REACT_APP_API_ROOT;

export const getPosts = async () => {
  const response = await axios.get(API_ROOT);
  return response?.data?.data || [];
};

export const getPost = async (id) => {
  const response = await axios.get(`${API_ROOT}/${id}`);
  return response?.data?.data || null;
};

// Posts are sent as multipart form data so an optional image file can go along.
const toFormData = ({ title, post, image }) => {
  const form = new FormData();
  form.append("title", title);
  form.append("post", post);
  if (image) form.append("image", image);
  return form;
};

export const createPost = async (post) => {
  const response = await axios.post(API_ROOT, toFormData(post));
  return response?.data?.data || null;
};

export const updatePost = async (id, post) => {
  const response = await axios.put(`${API_ROOT}/${id}`, toFormData(post));
  return response?.data?.data || null;
};

export const deletePost = async (id) => {
  const response = await axios.delete(`${API_ROOT}/${id}`);
  return response?.data?.data || null;
};

export const excerpt = (text = "", length = 160) =>
  text.length > length ? text.slice(0, length).trimEnd() + "…" : text;

// Stable placeholder photo seeded by an id or name.
export const imageFor = (seed, width = 800, height = 500) =>
  `https://picsum.photos/seed/fiberblog-${seed}/${width}/${height}`;

// A post's uploaded image (served by the API under /static/uploads),
// or its placeholder photo when it has none.
export const postImage = (post, width, height) =>
  post?.image ? `${API_ROOT}${post.image}` : imageFor(post?.id, width, height);

// One of six gradient themes, picked by id, used behind images and as accents.
export const themeFor = (id = 0) => `theme-${Number(id) % 6}`;
