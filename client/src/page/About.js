import { imageFor } from "../api";
import Cover from "../components/Cover";

const stack = [
  { name: "React", note: "UI & routing", theme: "theme-0" },
  { name: "Go Fiber", note: "REST API", theme: "theme-2" },
  { name: "GORM", note: "Database access", theme: "theme-4" },
];

const About = () => (
  <section className="container section">
    <div className="about">
      <div className="prose">
        <p className="eyebrow">About</p>
        <h1 className="page-title">A small blog with a fast backend.</h1>
        <p>
          FiberBlog is a small, fast blog built to explore pairing a React
          front end with a Go backend powered by Fiber and GORM.
        </p>
        <p>
          Posts are served from a JSON API and rendered here with a focus on
          readability: clean typography, plenty of white space and no clutter.
        </p>
      </div>
      <Cover src={imageFor("about", 800, 900)} theme="theme-1" className="about-image" />
    </div>

    <h2 className="stack-title">The stack</h2>
    <div className="stack">
      {stack.map((item) => (
        <div key={item.name} className={`stack-card ${item.theme}`}>
          <strong>{item.name}</strong>
          <span>{item.note}</span>
        </div>
      ))}
    </div>
  </section>
);

export default About;
