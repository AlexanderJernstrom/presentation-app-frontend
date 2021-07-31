import React, { useRef } from "react";
import { useStore } from "../stores/store";
import { ContextMenu } from "./ContextMenu";
import { Element } from "./Element";

export const PresentationEditor = () => {
  const elements = useStore(
    (state) =>
      state.currentPresentation?.slides[state.currentSlide as number].elements
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      style={{
        width: "75%",
        marginLeft: "3%",
        display: "flex",
        height: "80%",
        marginTop: "2%",
      }}
    >
      <div
        style={{
          boxShadow:
            "0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08)",
          width: "85%",
          borderRadius: "5px",
          backgroundColor: "white",
          position: "relative",
        }}
        ref={containerRef}
      >
        <ContextMenu containerRef={containerRef} />
        {elements?.map((element) => (
          <Element
            element={element}
            containerRef={containerRef}
            key={element.id}
          />
        ))}
      </div>
    </div>
  );
};
