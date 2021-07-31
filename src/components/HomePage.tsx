import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Presentation, PresentationEdit } from "../types/PresentationTypes";
import { MdDelete, MdEdit } from "react-icons/md";
import { apiURL } from "../App";

export const HomePage = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [presentationName, setPresentationName] = useState("");
  const history = useHistory();

  useEffect(() => {
    const getPresentations = async () => {
      const res = await fetch(`${apiURL}/presentations`, {
        method: "GET",
        headers: {
          token: localStorage.getItem("presentation-app-token") as string,
        },
      });

      if (res.status === 200) {
        const json: Presentation[] = await res.json();
        setPresentations(json);
        setLoading(false);
      }
    };
    getPresentations();
  }, []);

  const deletePresentation = async (id: number) => {
    const res = await fetch(`${apiURL}/deletePresentation?id=${id}`, {
      method: "DELETE",
      headers: {
        token: localStorage.getItem("presentation-app-token") as string,
      },
    });
    if (res.status === 200) {
      const response = await res.text();
      console.log(response);
      window.location.reload();
    }
  };

  const createPresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestBody = JSON.stringify({ name: presentationName });
    const res = await fetch(`${apiURL}/createPresentation`, {
      method: "POST",
      body: requestBody,
      headers: {
        token: localStorage.getItem("presentation-app-token") as string,
      },
    });
    if (res.status !== 200) {
      alert("Something went wrong when creating this presentation");
      return;
    }
    const jsonData: PresentationEdit = await res.json();
    history.push(`/presentation/${jsonData.id}`);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Presentation app</h1>
      {loading ? (
        <p>...loading</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gridGap: "4rem",
          }}
        >
          {presentations.map((presentation) => (
            <div
              key={presentation.id}
              style={{
                boxShadow:
                  " 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08)",
                borderRadius: "2px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <h3 style={{ textAlign: "center" }}>{presentation.name}</h3>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link to={`/presentation/${presentation.id}`}>
                  <button
                    className="icon-button"
                    style={{
                      color: "#1d1d1d",
                    }}
                  >
                    <MdEdit />
                  </button>
                </Link>
                <button
                  onClick={() => deletePresentation(presentation.id)}
                  className="icon-button"
                  style={{
                    color: "#cc3300",
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "50%",
          marginLeft: "25%",
          marginTop: "5rem",
          textAlign: "center",
        }}
      >
        <label>Create new presentation</label>
        <input
          placeholder="Name of presentation"
          style={{
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "3px solid black",
            marginTop: "1rem",
            textAlign: "center",
            borderRadius: "5px",
            padding: "0.5rem",
            outline: "none",
            fontSize: "15px",
          }}
          onChange={(e) => setPresentationName(e.target.value)}
        />
        <button
          className="button"
          style={{
            width: "50%",
            marginLeft: "25%",
            marginTop: "2%",
            height: "2rem",
            backgroundColor: "#40F26A",
          }}
          type="submit"
          onClick={async (e) => await createPresentation(e)}
        >
          Create presentation
        </button>
      </form>
    </div>
  );
};
