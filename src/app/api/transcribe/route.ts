import OpenAI from "openai";
import { getSession } from "@auth0/nextjs-auth0";

const openai = new OpenAI();

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

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }
  
  console.log("File received:", file.name, file.type); // Log file details

  try {
    // Pass the file directly (as it is of type File or Blob)
    const transcription = await openai.audio.transcriptions.create({
      file, // Pass the file object directly
      model: "whisper-1", // Assuming you're using whisper-2
    });

    // Return the transcription text in the response
    return new Response(JSON.stringify({ text: transcription.text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return new Response("Error during transcription", { status: 500 });
  }
}
