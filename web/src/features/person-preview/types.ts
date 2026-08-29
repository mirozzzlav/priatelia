export type PersonPreview = {
  age: string;
  bio: string;
  id: string;
  meta: string[];
  name: string;
  photo: string;
  photos: string[];
  tags: string[];
};

export type PersonPreviewAction = "like" | "nope";

export type ActivePersonPreviewAction = PersonPreviewAction | null;

export type PersonPreviewActionHandlers = {
  onActionEnd: () => void;
  onActionStart: (action: PersonPreviewAction) => void;
};
