import React from "react";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { apiURL } from "../App";
import {
  Presentation,
  PresentationEdit,
  PresentationElement,
  Slide,
} from "../types/PresentationTypes";

type State = {
  currentPresentation: PresentationEdit | null;
  setPresentation: (presentation: PresentationEdit) => void;
  currentSlide: number | null;
  selectSlide: (slideIndex: number) => void;
  editContent: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    elementIndex: number
  ) => void;
  updatePosition: (x: number, y: number, index: number) => void;
  createTextElement: () => void;
  createSlide: () => void;
  savePresentation: () => void;
  createImageElement: (imageURL: string) => void;
  deleteElement: (elementID: number) => void;
  deletePresentation: (presentationID: number) => void;
  changeName: (name: string) => void;
};

export const useStore = create<State>(
  devtools((set, get) => ({
    setPresentation: (presentation) =>
      set(() => ({
        currentPresentation: presentation,
        currentSlide: presentation.slides.indexOf(presentation.slides[0]),
      })),

    currentPresentation: null,

    currentSlide: null,

    selectSlide: (slide) => {
      if (
        slide < (get().currentPresentation?.slides.length as number) &&
        slide > -1
      ) {
        set(() => ({ currentSlide: slide }));
      }
    },

    editContent: async (
      e: React.ChangeEvent<HTMLTextAreaElement>,
      index: number
    ) => {
      const presentationCopy = { ...get().currentPresentation };
      (presentationCopy as PresentationEdit).slides[
        get().currentSlide as number
      ].elements[index].content = e.target.value;
      const element = (presentationCopy as PresentationEdit).slides[
        get().currentSlide as number
      ].elements[index];

      const requestBody = {
        position_x: element.position_x,
        position_y: element.position_y,
        width: element.width,
        height: element.height,
        content: e.target.value,
      };

      const res = await fetch(`${apiURL}/updateElement?id=${element.id}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        headers: {
          token: localStorage.getItem("presentation-app-token") as string,
        },
      });
      const json: typeof requestBody = await res.json();

      (presentationCopy as PresentationEdit).slides[
        get().currentSlide as number
      ].elements[index] = {
        position_x: json.position_x,
        position_y: json.position_y,
        width: json.width,
        height: json.height,
        content: json.content,
        id: element.id,
        type: element.type,
        slide_id: element.slide_id,
      };

      set({ currentPresentation: presentationCopy as PresentationEdit });
    },

    updatePosition: async (x: number, y: number, index: number) => {
      const presentationCopy = { ...get().currentPresentation };
      const element = (presentationCopy as PresentationEdit).slides[
        get().currentSlide as number
      ].elements[index];
      element.position_x = x;
      element.position_y = y;

      const requestBody = {
        position_x: x,
        position_y: y,
        width: element.width,
        height: element.height,
        content: element.content,
      };
      const res = await fetch(`${apiURL}/updateElement?id=${element.id}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        headers: {
          token: localStorage.getItem("presentation-app-token") as string,
        },
      });
      const json: typeof requestBody = await res.json();

      (presentationCopy as PresentationEdit).slides[
        get().currentSlide as number
      ].elements[index] = {
        position_x: json.position_x,
        position_y: json.position_y,
        width: json.width,
        height: json.height,
        content: json.content,
        id: element.id,
        type: element.type,
        slide_id: element.slide_id,
      };

      set({ currentPresentation: presentationCopy as PresentationEdit });
    },
    createTextElement: async () => {
      const presentationCopy = { ...get().currentPresentation };
      const res = await fetch(
        `${apiURL}/createElement?id=${
          get().currentPresentation?.slides[get().currentSlide as number].id
        }`,
        {
          method: "POST",
          body: JSON.stringify({ type: "Text" }),
          headers: {
            token: localStorage.getItem("presentation-app-token") as string,
          },
        }
      );
      const json: PresentationElement = await res.json();
      (presentationCopy as PresentationEdit).slides[
        get().currentSlide as number
      ].elements = [
        ...(presentationCopy as PresentationEdit).slides[
          get().currentSlide as number
        ].elements,
        json,
      ];
      set({ currentPresentation: presentationCopy as PresentationEdit });
    },
    createImageElement: async (imageURL: string) => {
      const presentationCopy = { ...get().currentPresentation };
      const res = await fetch(
        `${apiURL}/createElement?id=${
          (get().currentPresentation?.slides[get().currentSlide as number]
            ?.id as number) + 1
        }`,
        {
          method: "POST",
          body: JSON.stringify({ type: "Image" }),
          headers: {
            token: localStorage.getItem("presentation-app-token") as string,
          },
        }
      );
      let json: PresentationElement = await res.json();
      json.content = imageURL;
      const response = await fetch(`${apiURL}/updateElement?id=${json.id}`, {
        method: "PATCH",
        body: JSON.stringify(json),
        headers: {
          token: localStorage.getItem("presentation-app-token") as string,
        },
      });
      json = await response.json();

      (presentationCopy as PresentationEdit).slides[
        get().currentSlide as number
      ].elements = [
        ...(presentationCopy as PresentationEdit).slides[
          get().currentSlide as number
        ].elements,
        json,
      ];
      set({ currentPresentation: presentationCopy as PresentationEdit });
    },
    createSlide: async () => {
      const presentationCopy = { ...get().currentPresentation };
      const res = await fetch(
        `${apiURL}/createSlide?id=${presentationCopy.id}`,
        {
          method: "POST",
          headers: {
            token: localStorage.getItem("presentation-app-token") as string,
          },
        }
      );
      const json: Slide = await res.json();
      json.elements = [];
      presentationCopy.slides = [...(presentationCopy.slides as Slide[]), json];
      set({
        currentPresentation: presentationCopy as PresentationEdit,
        currentSlide: 0,
      });
    },
    deleteElement: async (elementID: number) => {
      const presentationCopy = { ...get().currentPresentation };
      const res = await fetch(`${apiURL}/deleteElement?id=${elementID}`, {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("presentation-app-token") as string,
        },
      });

      if (res.status === 200) {
        console.log("this happemed");
        const elements = [
          ...(presentationCopy as PresentationEdit).slides[
            get().currentSlide as number
          ].elements,
        ];
        const filteredElements = elements.filter((el) => el.id !== elementID);
        (presentationCopy as PresentationEdit).slides[
          get().currentSlide as number
        ].elements = filteredElements;
        set({ currentPresentation: presentationCopy as PresentationEdit });
      }
    },
    savePresentation: async () => {
      const id = get().currentPresentation?.id;
      const res = await fetch(`${apiURL}/updatePresentation?id=${id}`, {
        method: "POST",
        body: JSON.stringify(get().currentPresentation),
        headers: {
          token: localStorage.getItem("presentation-app-token") as string,
        },
      });
      const json = await res.json();
    },
    deletePresentation: (presentationID: number) => {},
    changeName: async (name: string) => {
      const presentationCopy = { ...get().currentPresentation };
      presentationCopy.name = name;
      const res = await fetch(
        `${apiURL}/changeName?id=${presentationCopy?.id}`,
        {
          body: JSON.stringify({ name }),
          method: "PATCH",
          headers: {
            token: localStorage.getItem("presentation-app-token") as string,
          },
        }
      );
      const json: { name: string } = await res.json();
      presentationCopy.name = json.name;
      set({ currentPresentation: presentationCopy as PresentationEdit });
    },
  }))
);
