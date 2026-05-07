import { CreateNote } from "@/types/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialDraft: CreateNote = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteDraftStore = {
  draft: CreateNote;
  setDraft: (note: CreateNote) => void;
  clearDraft: () => void;
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
