import OpenAI from "openai";
import { getSession } from "@auth0/nextjs-auth0";

const openai = new OpenAI();

// Define the allowed response formats
type ResponseFormat = "json" | "text" | "srt" | "verbose_json" | "vtt";

export async function POST(req: Request) {
  // Manually handle Auth0 session
  const session = await getSession();

  // If no user, return a 401 error
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Parse the incoming request
  const formData = await req.formData();

  // Get the file from the FormData
  const file = formData.get("file") as File;
  const model = (formData.get("model") as string) || "whisper-1"; // Default model to whisper-1
  const language = formData.get("language") as string | null;
  const prompt = formData.get("prompt") as string | null;
  const responseFormat =
    (formData.get("response_format") as ResponseFormat) || "json"; // Default to json
  const temperature = formData.get("temperature")
    ? parseFloat(formData.get("temperature") as string)
    : 0; // Default to 0
  const timestampGranularities = formData.get("timestamp_granularities")
    ? JSON.parse(formData.get("timestamp_granularities") as string)
    : null;

  // Validate file presence
  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  try {
    // Pass the file directly (as it is of type File or Blob)
    const transcription = await openai.audio.transcriptions.create({
      file, // Pass the file object directly
      model, // Add model (default to whisper-1)
      language: language || undefined, // Optional
      prompt: prompt || undefined, // Optional
      response_format: responseFormat, // Typed as ResponseFormat
      temperature: temperature || undefined, // Optional
      timestamp_granularities: timestampGranularities || undefined, // Optional
    });

    // Handle different response formats
    let responseBody;
    const contentType = "application/json"; // Default content type is JSON
    console.log(responseFormat, transcription)
    switch (responseFormat) {
      case "json":
      case "verbose_json":
        // Default JSON responses
        responseBody = JSON.stringify(transcription);
        break;
      case "text":
        // Plain text responses
        responseBody = JSON.stringify({ text: transcription });
        break;
      case "srt":
        // Plain text responses
        responseBody = JSON.stringify({ srt: transcription });
        break;
      case "vtt":
        // Plain text responses
        responseBody = JSON.stringify({ vtt: transcription });
        break;
      default:
        // Fallback to JSON if something goes wrong
        responseBody = JSON.stringify({ error: "Invalid response format" });
        break;
    }

    // Return the transcription in the proper format
    return new Response(responseBody, {
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return new Response("Error during transcription", { status: 500 });
  }
}
