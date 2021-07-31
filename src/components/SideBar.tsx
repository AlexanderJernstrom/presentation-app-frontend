import React, { useEffect, useState } from "react";
import { MdArrowBack, MdPlayArrow, MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { useStore } from "../stores/store";
import { Modal } from "./Modal";

export const SideBar = () => {
  const createTextElement = useStore((state) => state.createTextElement);
  const createImageElement = useStore((state) => state.createImageElement);
  const changeName = useStore((state) => state.changeName);
  const presentation = useStore((state) => state.currentPresentation);
  const id = useStore((state) => state.currentPresentation?.id);
  const [showModal, setShowModal] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const handleEscape = (e: KeyboardEvent) => {
    if (showModal === true && e.key === "Escape") {
      setShowModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        boxShadow:
          "0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div style={{ display: "flex" }}>
        <Link to="/">
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <MdArrowBack size={"2em"} />
          </button>
        </Link>
        <input
          style={{ textAlign: "center", fontSize: "17px" }}
          value={presentation?.name}
          onChange={(e) => changeName(e.target.value)}
        />
      </div>

      <button className="button" onClick={() => createTextElement()}>
        Create text element
        <MdAdd />
      </button>
      <button
        className="button"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Create image element
        <MdAdd />
      </button>
      <Link to={`/presentation/${id}/play`}>
        <button className="button" style={{ width: "100%", fontSize: "1rem" }}>
          <MdPlayArrow />
        </button>
      </Link>
      <Modal show={showModal}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <button
            onClick={() => setShowModal(false)}
            style={{
              backgroundColor: "red",
              color: "white",
              outline: "none",
              border: "none",
              position: "absolute",
              right: "0px",
              top: "0px",
              cursor: "pointer",
              width: "5%",
              height: "5%",
            }}
          >
            X
          </button>
          <h1 style={{ textAlign: "center" }}>Add image to presentation</h1>
          <input
            style={{
              borderTop: "none",
              borderRight: "none",
              borderLeft: "none",
              borderBottom: "1px solid lightgrey",
              outline: "none",
              fontSize: "17px",
              textAlign: "center",
            }}
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="Link to your image"
          />
          <button
            style={{
              width: "50%",
              marginLeft: "25%",
              marginTop: "2%",
              height: "2rem",
              backgroundColor: "#40F26A",
            }}
            onClick={() => createImageElement(imageURL)}
            className="button"
          >
            Insert image
          </button>
        </div>
      </Modal>
    </div>
  );
};
