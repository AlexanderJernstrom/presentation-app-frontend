import React, { useState } from "react";
import { useRef } from "react";
import { useStore } from "../stores/store";
import { PresentationElement, Slide } from "../types/PresentationTypes";

interface Props {
  element: PresentationElement;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const Element: React.FC<Props> = ({ element, containerRef }) => {
  const [movePosition, setMovePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const updatePosition = useStore((state) => state.updatePosition);
  const editContent = useStore((state) => state.editContent);
  const presentation = useStore((state) => state.currentPresentation?.slides);
  const currentSlide = useStore((state) => state.currentSlide);
  const elementRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const pickUpElement = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);

      setMovePosition({
        x:
          (e.pageX -
            (elementRef.current?.clientWidth as number) / 2 -
            (containerRef.current?.offsetLeft as number)) /
          (containerRef.current?.clientWidth as number),
        y:
          (e.pageY -
            (elementRef.current?.clientHeight as number) / 2 -
            (containerRef.current?.offsetTop as number)) /
          (containerRef.current?.clientHeight as number),
      });
    }
  };

  const moveElement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (isDragging) {
      const x =
        (e.pageX -
          (elementRef.current?.clientWidth as number) / 2 -
          (containerRef.current?.offsetLeft as number)) /
        (containerRef.current?.clientWidth as number);
      const y =
        (e.pageY -
          (elementRef.current?.clientHeight as number) / 2 -
          (containerRef.current?.offsetTop as number)) /
        (containerRef.current?.clientHeight as number);
      if (x < 1 && y < 1) {
        setMovePosition({
          x,
          y,
        });
        return;
      }
    }
  };

  const dropElement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (isDragging) {
      const x =
        (e.pageX -
          (elementRef.current?.clientWidth as number) / 2 -
          (containerRef.current?.offsetLeft as number)) /
        (containerRef.current?.clientWidth as number);

      const y =
        (e.pageY -
          (elementRef.current?.clientHeight as number) / 2 -
          (containerRef.current?.offsetTop as number)) /
        (containerRef.current?.clientHeight as number);
      const index = (presentation as Slide[])[
        currentSlide as number
      ]?.elements.indexOf(element);

      console.log(x, y);
      updatePosition(x, y, index);
      setIsDragging(false);
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: isDragging
          ? `${movePosition.x * 100}%`
          : `${element.position_x * 100}%`,
        top: isDragging
          ? `${movePosition.y * 100}%`
          : `${element.position_y * 100}%`,
      }}
    >
      {element.type === "Text" ? (
        <textarea
          ref={textAreaRef}
          onMouseDown={(e) => pickUpElement(e)}
          onMouseMove={(e) => moveElement(e)}
          onMouseUp={(e) => dropElement(e)}
          defaultValue={element.content}
          id="element"
          data-id={`${element.id}`}
          placeholder="Start typing by clicking"
          style={{
            width: "100%",
            height: "100%",
            outline: "none",
            cursor: isDragging ? "move" : "auto",
            border: isDragging ? "3px solid #51BBFE" : "none",
            resize: "none",
          }}
          onChange={(e) =>
            editContent(
              e,
              (presentation as Slide[])[
                currentSlide as number
              ].elements.indexOf(element)
            )
          }
        />
      ) : (
        <img
          src={element.content}
          style={{
            width: "100%",
            height: "100%",
            outline: "none",
            cursor: "move",
            border: isDragging ? "3px solid #51BBFE" : "none",
          }}
          alt=""
          onMouseDown={(e) => pickUpElement(e)}
          onMouseMove={(e) => moveElement(e)}
          onMouseUp={(e) => dropElement(e)}
          data-id={`${element.id}`}
          id="element"
        />
      )}
    </div>
  );
};
