import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./page/Home";
import About from "./page/About";
import Blog from "./page/Blog";
import BlogDetail from "./page/BlogDetail";
import Contact from "./page/Contact";
import Add from "./page/Add";
import NotFound from "./page/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add" element={<Add key="add" />} />
        <Route path="/edit/:id" element={<Add key="edit" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
