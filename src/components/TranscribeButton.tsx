"use client";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Loader2 } from "lucide-react";

// Define the mutation function for file upload
async function uploadFile(url: string, { arg }: { arg: FormData }) {
  const response = await fetch(url, {
    method: "POST",
    body: arg, // FormData object containing the file and other fields
  });

  if (!response.ok) {
    throw new Error("Failed to upload file and transcribe.");
  }

  return response.json(); // Return the response as JSON
}

export default function TranscribeButton() {
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState("whisper-1");
  const [language, setLanguage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [responseFormat, setResponseFormat] = useState("json");
  const [temperature, setTemperature] = useState<number | null>(null);
  const [timestampGranularities, setTimestampGranularities] = useState<
    string[]
  >([]);

  // Initialize the SWR mutation hook
  const { trigger, isMutating, error, data } = useSWRMutation(
    "/api/transcribe",
    uploadFile
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile); // Set the selected file
  };

  const handleUpload = async () => {
    if (!file) return; // Don't trigger if no file is selected

    const formData = new FormData();
    formData.append("file", file); // Add the file to the FormData
    formData.append("model", model); // Add the required model
    if (language) formData.append("language", language); // Add optional language if provided
    if (prompt) formData.append("prompt", prompt); // Add optional prompt if provided
    formData.append("response_format", responseFormat); // Add optional response format
    if (temperature !== null)
      formData.append("temperature", temperature.toString()); // Add optional temperature if provided
    if (timestampGranularities.length > 0) {
      formData.append(
        "timestamp_granularities",
        JSON.stringify(timestampGranularities)
      ); // Add timestamp granularities
    }

    // Trigger the mutation by passing the FormData
    trigger(formData);
  };

  useEffect(() => {
    if (responseFormat != "verbose_json") {
      setTimestampGranularities([]);
    }
  }, [responseFormat])

  return (
    <div className="max-w-lg mx-auto space-y-6 p-4 bg-white rounded-md shadow-md dark:bg-gray-900">
      {/* File Upload and Model (Essential Fields) */}
      <Label htmlFor="file" className="font-medium">
        Upload Audio File:
      </Label>
      <Input
        id="file"
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={isMutating}
        className="border border-gray-300 rounded-md"
      />

      <Label htmlFor="responseFormat" className="font-medium">
        Response Format:
      </Label>
      <Select
        onValueChange={(value) => setResponseFormat(value)}
        value={responseFormat}
      >
        <SelectTrigger id="responseFormat">
          <SelectValue placeholder="Select response format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="srt">SRT</SelectItem>
          <SelectItem value="verbose_json">Verbose JSON</SelectItem>
          <SelectItem value="vtt">VTT</SelectItem>
        </SelectContent>
      </Select>

      {responseFormat === "verbose_json" && (
        <>
          <Label className="font-medium">
            Timestamp Granularities (Optional):
          </Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={timestampGranularities.includes("word")}
                onCheckedChange={(checked) =>
                  setTimestampGranularities((prev) =>
                    checked
                      ? [...prev, "word"]
                      : prev.filter((item) => item !== "word")
                  )
                }
                disabled={isMutating}
              />
              <Label>Word</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={timestampGranularities.includes("segment")}
                onCheckedChange={(checked) =>
                  setTimestampGranularities((prev) =>
                    checked
                      ? [...prev, "segment"]
                      : prev.filter((item) => item !== "segment")
                  )
                }
                disabled={isMutating}
              />
              <Label>Segment</Label>
            </div>
          </div>
        </>
      )}

      {/* Popover for Optional Parameters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Adjust Optional Settings</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4 p-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Optional Settings</h4>
              <p className="text-sm text-muted-foreground">
                Adjust the following optional settings if needed.
              </p>
            </div>

            {/* Optional Inputs inside Popover */}
            <div className="grid gap-2">
              <Label htmlFor="model" className="font-medium">
                Model:
              </Label>
              <Select onValueChange={(value) => setModel(value)} value={model}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whisper-1">Whisper-1</SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="language" className="font-medium">
                Language (Optional):
              </Label>
              <Input
                id="language"
                type="text"
                placeholder="ISO-639-1 code (e.g. en, es, fr)"
                value={language || ""}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isMutating}
              />

              <Label htmlFor="prompt" className="font-medium">
                Prompt (Optional):
              </Label>
              <Input
                id="prompt"
                type="text"
                placeholder="Enter a prompt to guide the model"
                value={prompt || ""}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isMutating}
              />

              <Label htmlFor="temperature" className="font-medium">
                Temperature (Optional):
              </Label>
              <Input
                id="temperature"
                type="number"
                placeholder="0 to 1"
                min="0"
                max="1"
                step="0.01"
                value={temperature || ""}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                disabled={isMutating}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Transcribe Button */}
      <Button
        onClick={handleUpload}
        disabled={!file || isMutating}
        className="w-full"
      >
        {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Transcribe
      </Button>

      {/* Error and Result Display */}
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
      {data && (
        <div className="mt-4">
          <p className="font-medium">Transcription:</p>
          <pre className="text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
