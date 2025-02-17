import { NextRequest, NextResponse } from "next/server";
import { uploadToBucket } from "./s3";
import { PutObjectResponse } from "./schemas";

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded in field 'file'" }, { status: 400 });
    }
    if (!folder) {
      return NextResponse.json({ error: "No 'folder' field specified e.g. book_images, user_images" }, { status: 400 });
    }

    const data = await uploadToBucket(folder, file);
    const key = data.Key.split("/")[1];

    return NextResponse.json(PutObjectResponse.parse({ folder, key }), { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
