import { NextRequest, NextResponse } from "next/server";
import { deleteObject, getUrl } from "../s3";

export async function GET(req: NextRequest, props: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await props.params;
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    if (!key) {
      return NextResponse.json({ error: "Path paramater 'key' is required" }, { status: 400 });
    }
    if (!folder) {
      return NextResponse.json({ error: "Query paramater 'folder' is required" }, { status: 400 });
    }

    const url = getUrl(folder, key);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json({ error: "Failed to generate pre-signed URL" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await props.params;
    const folder = req.nextUrl.searchParams.get("folder");

    if (!key) {
      return NextResponse.json({ error: "Path parameter 'key' is required" }, { status: 400 });
    }
    if (!folder) {
      return NextResponse.json({ error: "Query parameter 'folder' is required" }, { status: 400 });
    }

    const deleted = await deleteObject(folder, key);

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete object" }, { status: 500 });
    }

    return NextResponse.json({ message: "Object deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting object:", error);
    return NextResponse.json({ error: "Failed to delete object" }, { status: 500 });
  }
}
