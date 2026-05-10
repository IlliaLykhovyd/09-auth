import { nextServer } from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";

export interface AuthPayload {
  email: string;
  password?: string;
}

export const register = async (data: AuthPayload): Promise<User> => {
  const response = await nextServer.post<User>("/auth/register", data);
  return response.data;
};

export const login = async (data: AuthPayload): Promise<User> => {
  const response = await nextServer.post<User>("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const response = await nextServer.get<User>("/auth/session");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const response = await nextServer.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (data: Partial<User>): Promise<User> => {
  const response = await nextServer.patch<User>("/users/me", data);
  return response.data;
};

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
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
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
  const response = await nextServer.post<Note>("/notes", newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};
