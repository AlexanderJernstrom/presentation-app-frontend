import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../stores/store";
import * as H from "history";
import { PresentationEdit } from "../types/PresentationTypes";
import { PlayControls } from "./PlayControls";
import { useKeyPress } from "../hooks/useKeyPress";
import { apiURL } from "../App";

interface RouteComponentProps {
  location: H.Location<any>;
  history: H.History;
  match: any;
  staticContext?: any;
}

interface Props extends RouteComponentProps {}

export const PresentationMode: React.FC<Props> = ({ match }) => {
  const currentSlide = useStore((state) => state.currentSlide);
  const presentation = useStore((state) => state.currentPresentation);
  const setPresentation = useStore((state) => state.setPresentation);
  const [loading, setLoading] = useState(true);
  const mainContainer = useRef<HTMLDivElement | null>(null);
  const changeSlide = useStore((state) => state.selectSlide);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const leftPressed = useKeyPress("ArrowLeft");
  const rightPressed = useKeyPress("ArrowRight");
  const fPressed = useKeyPress("f");

  useEffect(() => {
    if (rightPressed) {
      changeSlide((currentSlide as number) + 1);
      return;
    }
    if (leftPressed) {
      changeSlide((currentSlide as number) - 1);
      return;
    }
    if (fPressed) {
      if (!document.fullscreenElement) {
        console.log("this happened right here right now");
        document.documentElement
          .requestFullscreen()
          .then(() => console.log("this happened"))
          .catch((err) =>
            alert(`Error when trying to enter fullscreen ${err}`)
          );
        setIsFullScreen(true);
      } else {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, [leftPressed, rightPressed, fPressed, changeSlide, currentSlide]);

  useEffect(() => {
    const fetchPresentation = async () => {
      const res = await fetch(`${apiURL}/presentation?id=${match.params.id}`, {
        headers: {
          token: localStorage.getItem("presentation-app-token") as string,
        },
      });
      const json: PresentationEdit = await res.json();
      setPresentation(json);
      setLoading(false);
    };
    fetchPresentation();
  }, [match.params.id, setPresentation]);

  console.log(presentation);

  return (
    <div>
      {loading ? (
        <div>..loading</div>
      ) : (
        <div>
          {!isFullScreen ? (
            <p style={{ position: "absolute" }}>
              Press the f-key to enter fullscreen
            </p>
          ) : null}
          <div
            ref={mainContainer}
            style={{ width: "100%", position: "relative", height: "100vh" }}
          >
            {presentation?.slides[currentSlide as number].elements.map(
              (element) =>
                element.type === "Text" ? (
                  <div
                    style={{
                      position: "absolute",
                      left: `${element.position_x * 100}%`,
                      top: `${element.position_y * 100}%`,
                      width: `${element.width * 100}%`,
                      height: `${element.height * 100}%`,
                    }}
                  >
                    <h4>{element.content}</h4>
                  </div>
                ) : element.type === "Image" ? (
                  <div
                    style={{
                      position: "absolute",
                      left: `${element.position_x * 100}%`,
                      top: `${element.position_y * 100}%`,
                      width: `${element.width * 100}%`,
                      height: `${element.height * 100}%`,
                    }}
                  >
                    <img
                      src={element.content}
                      alt=""
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                ) : null
            )}
          </div>
          <PlayControls />
        </div>
      )}
    </div>
  );
};
