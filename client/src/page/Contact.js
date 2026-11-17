import { useState } from "react";
import { imageFor } from "../api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: the API has no contact endpoint yet; send `form` to it here.
    setSent(true);
  };

  return (
    <section className="container section">
      <div className="contact">
        <aside
          className="contact-panel"
          style={{ backgroundImage: `url(${imageFor("contact", 700, 900)})` }}
        >
          <div className="contact-panel-inner">
            <p className="eyebrow">Contact</p>
            <h1>Let's talk.</h1>
            <p>Have a question or an idea for a post? Send a message and I'll get back to you.</p>
          </div>
        </aside>

        <div className="contact-form">
          {sent ? (
            <div className="notice">
              <strong>Thanks, {form.name}!</strong>
              <p>Your message has been received.</p>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Message
                <textarea name="message" rows="6" value={form.message} onChange={handleChange} required />
              </label>
              <button type="submit" className="btn">Send message</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
