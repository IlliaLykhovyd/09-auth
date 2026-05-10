import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api/serverApi";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slug[0];
  return {
    title: `NoteHub - ${category} notes`,
    description: `View all of your ${category} notes on Notehub`,
    openGraph: {
      title: `NoteHub - ${category} notes`,
      description: `View all of your ${category} notes on Notehub`,
      url: `https://08-zustand-j3n5.vercel.app/notes/filter/${category}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: category,
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", slug[0]],
    queryFn: () => fetchNotes({ query: "", page: 1, perPage: 8, tag: slug[0] }),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={slug[0]} />
      </HydrationBoundary>
    </>
  );
}
