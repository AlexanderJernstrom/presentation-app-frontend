export interface PresentationElement {
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  content: string;
  type: "Text" | "Image";
  id: number;
  slide_id: number;
}

export interface Slide {
  elements: PresentationElement[];
  presentation_id: number;
  id: number;
}

export interface PresentationEdit {
  id: number;
  user_id: number;
  name: string;
  slides: Slide[];
}

export interface Presentation {
  id: number;
  user_id: number;
  name: string;
}
