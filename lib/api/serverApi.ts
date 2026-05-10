import "server-only";
import { nextServer } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { FetchNotesParams, FetchNotesResponse } from "./clientApi";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
};

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const headers = await getAuthHeaders();
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      search: params.query,
      page: params.page,
      perPage: params.perPage,
      tag: params.tag,
    },
    headers,
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getAuthHeaders();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers,
  });
  return response.data;
};

export const getMe = async (): Promise<User | null> => {
  try {
    const headers = await getAuthHeaders();
    const response = await nextServer.get<User>("/users/me", {
      headers,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const checkSession = async () => {
  const cookieStore = await cookies();
  const response = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};
