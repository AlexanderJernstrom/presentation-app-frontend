import React from "react";
import { useStore } from "../stores/store";

export const PlayControls = () => {
  const currentSlide = useStore((state) => state.currentSlide);
  const changeSlide = useStore((state) => state.selectSlide);
  return (
    <div
      style={{
        position: "absolute",
        left: "3%",
        bottom: "3%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: "3%",
        width: "15%",
        backgroundColor: "black",
        color: "white",
        borderRadius: "3px",
      }}
    >
      <button
        style={{ height: "75%", width: "40%" }}
        className="button"
        onClick={() => changeSlide((currentSlide as number) - 1)}
      >
        Previous
      </button>
      <h4>{(currentSlide as number) + 1}</h4>
      <button
        style={{ height: "75%", width: "30%" }}
        className="button"
        onClick={() => changeSlide((currentSlide as number) + 1)}
      >
        Next
      </button>
    </div>
  );
};
