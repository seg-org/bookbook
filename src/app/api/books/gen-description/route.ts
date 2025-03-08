import { NextRequest, NextResponse } from "next/server";

import { GenBookDescRequest, GenBookDescResponse } from "../schemas";

const API_KEY = process.env.HF_API_KEY;
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

export async function POST(req: NextRequest) {
  try {
    const parsedData = GenBookDescRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const title = parsedData.data.title;
    if (!title) {
      return NextResponse.json({ error: "Missing book name" }, { status: 400 });
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Describe the book '${title}' briefly. Do not put other things, I wany ONLY the description (no quotations)`,
      }),
    });

    const data: { generated_text: string }[] = await response.json();
    const description = data[0].generated_text.split("\n\n").slice(1).join("\n\n");

    return NextResponse.json(
      GenBookDescResponse.parse({ title, description: description || "No description generated." })
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
  }
}
