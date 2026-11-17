import { useState } from "react";

// Image on top of a coloured gradient; if the image fails, the gradient remains.
const Cover = ({ src, alt = "", className = "", theme = "theme-0" }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`cover ${theme} ${className}`}>
      {!failed && (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      )}
    </div>
  );
};

export default Cover;
