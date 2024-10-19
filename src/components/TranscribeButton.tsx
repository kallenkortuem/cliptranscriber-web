"use client";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

// Define the mutation function for file upload
async function uploadFile(url: string, { arg }: { arg: FormData }) {
  const response = await fetch(url, {
    method: "POST",
    body: arg, // FormData object containing the file
  });

  if (!response.ok) {
    throw new Error("Failed to upload file and transcribe.");
  }

  return response.json(); // Return the response as JSON
}

export default function TranscribeButton() {
  const [file, setFile] = useState<File | null>(null);

  // Initialize the SWR mutation hook
  const { trigger, isMutating, error, data } = useSWRMutation("/api/transcribe", uploadFile);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      console.log(`File selected: ${selectedFile.name}, type: ${selectedFile.type}`);
    }
    setFile(selectedFile); // Set the selected file
  };

  const handleUpload = async () => {
    if (!file) return; // Don't trigger if no file is selected

    const formData = new FormData();
    formData.append("file", file); // Add the file to the FormData

    // Trigger the mutation by passing the FormData
    trigger(formData);
  };

  return (
    <div>
      <input type="file" accept="audio/flac,audio/m4a,audio/mp3,audio/mp4,audio/mpeg,audio/mpga,audio/oga,audio/ogg,audio/wav,audio/webm" onChange={handleFileChange} disabled={isMutating} />

      <Button onClick={handleUpload} disabled={!file || isMutating}>
        {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Transcribe
      </Button>

      {error && <p className="text-red-500 mt-2">{error.message}</p>}
      {data && <p className="mt-2">Transcription: {data.text}</p>}
    </div>
  );
}
