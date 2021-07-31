import React, { useEffect } from "react";

interface Props {
  children?: JSX.Element;
  show: boolean;
}

export const Modal: React.FC<Props> = ({ children, show }) => {
  return (
    <div>
      {show ? (
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            zIndex: 15,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};
