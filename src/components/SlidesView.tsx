import React from "react";
import { useStore } from "../stores/store";

export const SlidesView = () => {
  const presentation = useStore((state) => state.currentPresentation);
  const createSlide = useStore((state) => state.createSlide);
  const selectSlide = useStore((state) => state.selectSlide);
  const currentSlide = useStore((state) => state.currentSlide);

  return (
    <div
      style={{
        width: "30%",
        boxShadow:
          "0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08)",
        borderRadius: "3px",
        overflowY: "scroll",
        backgroundColor: "white",
      }}
    >
      {presentation?.slides.map((slide, index) => (
        <div
          key={slide.id}
          onClick={() => {
            selectSlide(index);
          }}
          style={{
            boxShadow:
              "0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08)",
            width: "50%",
            marginLeft: "25%",
            cursor: "pointer",
            border: index === currentSlide ? "0.3rem solid #51BBFE" : "none",
            borderRadius: "5px",
            height: "20%",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ position: "relative", left: "0px", top: "0px" }}>
            <h3>{index + 1}</h3>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center" }}>
        <button
          style={{ width: "50%", height: "2rem" }}
          className="button"
          onClick={() => createSlide()}
        >
          Create slide
        </button>
      </div>
    </div>
  );
};
