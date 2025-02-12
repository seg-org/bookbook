import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const API_KEY = process.env.HF_API_KEY;
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

const genBookDescRequest = z.object({
  title: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = genBookDescRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const bookName = parsedData.data.title;
    if (!bookName) {
      return NextResponse.json({ error: "Missing book name" }, { status: 400 });
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: `Describe the book '${bookName}' briefly.` }),
    });

    const data = await response.json();
    return NextResponse.json({ bookName, description: data[0]?.generated_text || "No description generated." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
  }
}
