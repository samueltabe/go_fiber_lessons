import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { createPost, getPost, postImage, updatePost } from "../api"
import Spinner from "../components/Spinner"

// Used for both /add (new post) and /edit/:id (edit an existing post)
const Add = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [current, setCurrent] = useState(null) // the post being edited
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { title: "", post: "" } })

  // In edit mode, load the post and fill the form with it
  useEffect(() => {
    if (!isEdit) return
    getPost(id)
      .then((post) => {
        if (post) {
          setCurrent(post)
          reset({ title: post.title, post: post.post })
        } else setServerError("Post not found.")
      })
      .catch((err) => setServerError(err?.response?.data?.msg || "Could not load the post."))
      .finally(() => setLoading(false))
  }, [id, isEdit, reset])

  const onSubmit = async (data) => {
    setServerError("")
    const payload = {
      title: data.title.trim(),
      post: data.post.trim(),
      image: data.image?.[0], // FileList → the chosen file, if any
    }
    try {
      if (isEdit) {
        await updatePost(id, payload)
        navigate("/blog")
      } else {
        await createPost(payload)
        navigate("/")
      }
    } catch (err) {
      setServerError(
        err?.response?.data?.msg ||
          (isEdit ? "Could not save your changes. Please try again." : "Could not publish the post. Please try again.")
      )
    }
  }

  return (
    <section className="container section narrow">
      <p className="eyebrow">{isEdit ? "Edit post" : "New post"}</p>
      <h1 className="page-title">{isEdit ? "Make some changes." : "Write something."}</h1>

      {loading ? (
        <Spinner label="Loading post…" />
      ) : (
        <form className="form form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>
            Title
            <input
              type="text"
              aria-invalid={errors.title ? "true" : "false"}
              {...register("title", {
                required: "Title is required",
                validate: (v) => v.trim() !== "" || "Title is required",
                maxLength: { value: 255, message: "Title must be 255 characters or fewer" },
              })}
            />
            {errors.title && <span className="error" role="alert">{errors.title.message}</span>}
          </label>

          <label>
            Post
            <textarea
              rows="8"
              placeholder="Start writing…"
              aria-invalid={errors.post ? "true" : "false"}
              {...register("post", {
                required: "Post is required",
                validate: (v) => v.trim() !== "" || "Post is required",
              })}
            />
            {errors.post && <span className="error" role="alert">{errors.post.message}</span>}
          </label>

          <label>
            Image {isEdit && current?.image && <span className="muted">(choose a file to replace it)</span>}
            {isEdit && current?.image && (
              <img src={postImage(current)} alt="Current" className="form-image-preview" />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              aria-invalid={errors.image ? "true" : "false"}
              {...register("image", {
                validate: (files) =>
                  !files?.[0] || files[0].size <= 5 * 1024 * 1024 || "Image must be 5 MB or smaller",
              })}
            />
            {errors.image && <span className="error" role="alert">{errors.image.message}</span>}
          </label>
          {serverError && <p className="error" role="alert">{serverError}</p>}

          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting
              ? isEdit ? "Saving…" : "Publishing…"
              : isEdit ? "Save changes" : "Publish post"}
          </button>
        </form>
      )}
    </section>
  )
}

export default Add
