import { NavLink, Link, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const Layout = () => (
  <div className="site">
    <header className="site-header">
      <div className="container nav">
        <Link to="/" className="brand">
          Fiber<span>Blog</span>
        </Link>
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>

    <main className="site-main">
      <Outlet />
    </main>

    <footer className="site-footer">
      <div className="container">
        © {new Date().getFullYear()} FiberBlog · Built with React &amp; Go Fiber
      </div>
    </footer>
  </div>
);

export default Layout;
