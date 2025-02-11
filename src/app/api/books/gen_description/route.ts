import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.HF_API_KEY; // Store your API key in .env
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

export async function POST(req: NextRequest) {
  try {
    const { bookName } = await req.json();
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
