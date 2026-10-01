import { useState } from "react";
import BookmarkForm from "./components/BookmarkForm";
import { Modal } from "./components/Modal";
import { useBookmarks } from "./hooks/useBookmarks";

export default function App() {
  const { bookmarks, isSubmitting, addBookmark, deleteBookmark } =
    useBookmarks();
  
  const [bookmarkToDelete, setBookmarkToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (bookmarkToDelete === null) return;
    setIsDeleting(true);
    await deleteBookmark(bookmarkToDelete);
    setIsDeleting(false);
    setBookmarkToDelete(null);
  };

  return (
    <>
      <section className="h-dvh flex flex-col items-center pt-8 md:pt-12 pb-6 p-4 bg-gray-50 dark:bg-gray-950 overflow-hidden">
        <header className="shrink-0 mb-6 w-full max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            LinkBox
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Save and organize your favorite links
          </p>
        </header>

        <main className="w-full max-w-2xl flex flex-col gap-8 flex-1 min-h-0">
          {/* Add Bookmark Form */}
          <BookmarkForm isSubmitting={isSubmitting} onSubmit={addBookmark} />
          {/* Saved Links List */}
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <h2 className="shrink-0 text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">
              Saved Links ({bookmarks.length})
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 pb-2 -mr-2">
              {bookmarks.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400">
                  No bookmarks saved yet. Add your first link above!
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md transition-all dark:bg-gray-900 dark:border-gray-800 dark:hover:border-blue-700"
                    >
                      <div className="flex flex-col min-w-0 overflow-hidden">
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-lg text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate"
                        >
                          {bookmark.label ? bookmark.label : bookmark.url}
                        </a>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="truncate">{bookmark.url}</span>
                          <span className="shrink-0 text-gray-300 dark:text-gray-600">
                            •
                          </span>
                          <span className="shrink-0">
                            {new Date(bookmark.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-2">
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-9 px-3 text-sm rounded-md font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                          Visit
                        </a>
                        <button
                          onClick={() => setBookmarkToDelete(bookmark.id)}
                          className="inline-flex items-center justify-center h-9 px-3 text-sm rounded-md font-medium bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </section>

      <Modal
        isOpen={bookmarkToDelete !== null}
        onClose={() => setBookmarkToDelete(null)}
        title="Delete Bookmark"
        description="Are you sure you want to delete this bookmark? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        isConfirming={isDeleting}
      />
    </>
  );
}
