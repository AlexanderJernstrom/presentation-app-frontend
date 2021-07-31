import React, { useEffect, useState } from "react";
import { SlidesView } from "./SlidesView";
import * as H from "history";
import { PresentationEdit } from "../types/PresentationTypes";
import { useStore } from "../stores/store";
import { PresentationEditor } from "./PresentationEditor";
import { SideBar } from "./SideBar";
import { apiURL } from "../App";

interface RouteComponentProps {
  location: H.Location<any>;
  history: H.History;
  match: any;
  staticContext?: any;
}

interface Props extends RouteComponentProps {}

export const PresentationView: React.FC<Props> = ({ match }) => {
  const setPresentation = useStore((state) => state.setPresentation);
  const presentation = useStore((state) => state.currentPresentation);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPresentation = async () => {
      const response = await fetch(
        `${apiURL}/presentation?id=${match.params.id}`,
        {
          headers: {
            token: localStorage.getItem("presentation-app-token") as string,
          },
        }
      );
      const json: PresentationEdit = await response.json();
      console.log(json.slides.length);
      setPresentation(json);
      setLoading(false);
    };
    getPresentation();
  }, [match.params.id, setPresentation]);

  return (
    <div>
      {loading ? (
        <p>...loading</p>
      ) : (
        <div>
          <SideBar />
          <div
            style={{
              width: "100%",
              height: `${window.innerHeight}px`,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <SlidesView />
            {(presentation?.slides.length as number) !== 0 ? (
              <PresentationEditor />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
