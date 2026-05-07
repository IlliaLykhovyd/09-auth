"use client";
import css from "./page.module.css";
import NoteList from "@/components/NoteList/NoteList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { useEffect, useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function NotesClient({ tag }: { tag: string }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const category = tag === "all" ? undefined : tag;

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["notes", page, query, category],
    queryFn: () => fetchNotes({ query, page, perPage: 8, tag: category }),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  const findTasks = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);

  useEffect(() => {
    if (isSuccess && data.notes.length === 0) {
      toast.error("No notes");
    }
  }, [isSuccess, data]);

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className={css.app}>
        <div className={css.toolbar}>
          <SearchBox onChange={findTasks} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(page) => setPage(page)}
            />
          )}
          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </div>
        {!isLoading && isSuccess && data.notes.length > 0 && (
          <NoteList notes={data.notes} />
        )}
      </div>
    </>
  );
}
