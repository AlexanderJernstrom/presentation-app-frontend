import React, { useEffect, useState } from "react";
import { useStore } from "../stores/store";

interface Props {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const ContextMenu: React.FC<Props> = ({ containerRef }) => {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [onElement, setOnElement] = useState(false);
  const [elementID, setElementID] = useState<number | null>(null);
  const deleteElement = useStore((state) => state.deleteElement);

  const closeMenu = () => {
    if (active) {
      setActive(false);
      setOnElement(false);
    }
  };

  const handleMenu = (e: MouseEvent) => {
    e.preventDefault();
    const element: HTMLElement = e.target as HTMLElement;
    console.log(element.parentElement);
    if (element.id === "element") {
      setOnElement(true);
      setElementID(Number(element.attributes[1].value));
    } else {
      setOnElement(false);
    }
    setActive(true);
    setPosition({
      x: e.pageX - (containerRef?.current?.offsetLeft as number),
      y: e.clientY - (containerRef?.current?.offsetTop as number),
    });
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);
    document.addEventListener("contextmenu", (e) => handleMenu(e));

    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("contextmenu", handleMenu);
    };
  }, [handleMenu, closeMenu]);

  return active ? (
    <div
      style={{
        position: "absolute",
        top: `${position.y}px`,
        left: `${position.x}px`,
        boxShadow:
          "0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08)",
        width: "15%",
        backgroundColor: "white",
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: "100%",
          marginLeft: "2rem",
        }}
      >
        <button
          style={{
            backgroundColor: "white",
            outline: "none",
            border: "none",
            cursor: "pointer",
          }}
          disabled={!onElement}
          onClick={() => {
            setActive(false);
            setOnElement(false);
            deleteElement(elementID as number);
          }}
        >
          Delete element
        </button>
      </div>
    </div>
  ) : null;
};
