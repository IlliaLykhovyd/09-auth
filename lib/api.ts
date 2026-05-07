import axios from "axios";
import type { Note } from "../types/note";

const myToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${myToken}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNote {
  title: string;
  content: string;
  tag?: string;
}

export interface FetchNotesParams {
  query?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      search: params.query, 
      page: params.page,
      perPage: params.perPage,
      tag: params.tag,
    },
  });
  return response.data;
};

export const createNote = async (newNote: CreateNote): Promise<Note> => {
  const response = await api.post<Note>("/notes", newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};
