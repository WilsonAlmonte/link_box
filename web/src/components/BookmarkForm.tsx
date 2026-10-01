import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

interface BookmarkFormProps {
  onSubmit: (url: string, title: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function BookmarkForm({
  onSubmit,
  isSubmitting,
}: BookmarkFormProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  async function handleSave() {
    await onSubmit(url, title);
    setTitle("");
    setUrl("");
  }

  return (
    <div className="shrink-0 flex flex-col gap-4 p-6 border border-gray-200 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800">
      <Input
        label="Bookmark URL"
        placeholder="https://example.com"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Input
        label="Title (Optional)"
        placeholder="My Awesome Link"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
      />
      <div className="flex gap-3 justify-end mt-4">
        <Button
          variant="secondary"
          onClick={() => {
            setUrl("");
            setTitle("");
          }}
          disabled={isSubmitting || (!url && !title)}
        >
          Clear
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSubmitting || !url}
        >
          Save Bookmark
        </Button>
      </div>
    </div>
  );
}
