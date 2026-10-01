"use strict";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface Bookmark {
  id: number;
  url: string;
  label?: string;
  date: string;
}

export interface ApiResponse {
  data: Bookmark[];
  success: boolean;
}

function request(path: string, init?: RequestInit) {
  const url = new URL(import.meta.env.VITE_API_URL + path);
  const apiKey = import.meta.env.VITE_API_KEY;
  return fetch(url, {
    ...init,
    headers: {
      "X-API-Key": apiKey,
      ...(init?.headers || {}),
    },
  });
}

export function useBookmarks() {
  const loaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchBookmarks(signal: AbortSignal): Promise<Bookmark[]> {
    const res = await request("/links", { signal });

    const payload = (await res.json()) as ApiResponse;
    return payload.data;
  }

  useEffect(() => {
    if (loaded.current) return;
    setIsLoading(true);
    const controller = new AbortController();
    (async function () {
      try {
        const bookmarks = await fetchBookmarks(controller.signal);
        setBookmarks([...bookmarks]);
        setIsLoading(false);
        loaded.current = true;
      } catch (error: any) {
        if (error.name === "AbortError") return;
        //catch the real one
        console.error(error);
        toast.error("Failed to load bookmarks");
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  async function addBookmark(url: string, title?: string) {
    setIsSubmitting(true);
    const newBookmark = { url, label: title };
    try {
      const res = await request("/links", {
        body: JSON.stringify(newBookmark),
        method: "POST",
      });

      const payload = await res.json();
      if (!payload.success) {
        console.error("something went wrong");
        toast.error("Failed to add bookmark");
        return;
      }

      setBookmarks((b) => [payload.data, ...b]);
      toast.success("Bookmark added successfully");
    } catch (err) {
      console.log(err);
      console.error("something went wrong");
      toast.error("Failed to add bookmark");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteBookmark(id: number) {
    try {
      const res = await request(`/links/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete bookmark");
      }

      setBookmarks((b) => b.filter((bookmark) => bookmark.id !== id));
      toast.success("Bookmark deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete bookmark");
    }
  }

  return {
    isLoading,
    bookmarks,
    isSubmitting,
    addBookmark,
    deleteBookmark,
  };
}
