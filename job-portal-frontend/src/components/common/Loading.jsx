import React from "react";

const Loading = ({ size = 48, color = "#2563eb" /* blue-600 */ }) => {
  // size in px, color customizable via props

  const style = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem 0",
      width: "100%",
    },
    svg: {
      animation: "spin 1s linear infinite",
      width: size,
      height: size,
      color: color,
      // Make svg responsive for small screens, max 20vw or 48px whichever is smaller
      maxWidth: "20vw",
      maxHeight: "20vw",
    },
    circle: {
      opacity: 0.25,
      stroke: "currentColor",
      strokeWidth: 4,
      fill: "none",
    },
    path: {
      opacity: 0.75,
      fill: "currentColor",
    },
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading"
        style={style.container}
      >
        <svg
          style={style.svg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            style={style.circle}
            cx="12"
            cy="12"
            r="10"
          />
          <path
            style={style.path}
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span style={{position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0}}>
          Loading...
        </span>
      </div>
    </>
  );
};

export default Loading;
