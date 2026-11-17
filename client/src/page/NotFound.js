import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="container section narrow">
    <h1 className="page-title">Page not found</h1>
    <p className="muted">The page you are looking for does not exist.</p>
    <Link to="/" className="btn">Go home</Link>
  </section>
);

export default NotFound;
