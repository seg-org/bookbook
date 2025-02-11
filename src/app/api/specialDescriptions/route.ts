import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSpecialDescriptionRequest = z.object({
  postId: z.string(),
  specialType: z.enum([
    "AUTHOR_SIGNATURE",
    "LIMITED_EDITION",
    "FIRST_EDITION",
    "SPECIAL_COVER_ART",
    "ILLUSTRATED_EDITION",
    "COLLECTORS_EDITION",
    "SLIPCASE_EDITION",
    "LEATHER_BOUND",
    "GILDED_EDGES",
    "DECKLE_EDGES",
    "POP_UP_ELEMENTS",
    "FOLD_OUT_PAGES",
    "HANDWRITTEN_NOTES_BY_AUTHOR",
    "PERSONALIZED_MESSAGE",
    "NUMBERED_EDITION",
    "EXCLUSIVE_ARTWORK",
    "EMBOSSED_COVER",
    "GOLD_FOIL_STAMPING",
    "BOX_SET",
    "ANNIVERSARY_EDITION",
    "HARDCOVER_WITH_DUST_JACKET",
    "TRANSPARENT_COVER",
    "ANNOTATED_EDITION",
    "SIGNED_BY_ILLUSTRATOR",
    "MAP_INSERT",
    "SUPPLEMENTARY_MATERIALS",
    "EXCLUSIVE_CONTENT",
    "FAN_ART_EDITION",
    "INTERACTIVE_ELEMENTS",
    "BILINGUAL_EDITION",
  ]),
});

const deleteSpecialDescriptionRequest = z.object({
  postId: z.string(),
  specialType: z.enum([
    "AUTHOR_SIGNATURE",
    "LIMITED_EDITION",
    "FIRST_EDITION",
    "SPECIAL_COVER_ART",
    "ILLUSTRATED_EDITION",
    "COLLECTORS_EDITION",
    "SLIPCASE_EDITION",
    "LEATHER_BOUND",
    "GILDED_EDGES",
    "DECKLE_EDGES",
    "POP_UP_ELEMENTS",
    "FOLD_OUT_PAGES",
    "HANDWRITTEN_NOTES_BY_AUTHOR",
    "PERSONALIZED_MESSAGE",
    "NUMBERED_EDITION",
    "EXCLUSIVE_ARTWORK",
    "EMBOSSED_COVER",
    "GOLD_FOIL_STAMPING",
    "BOX_SET",
    "ANNIVERSARY_EDITION",
    "HARDCOVER_WITH_DUST_JACKET",
    "TRANSPARENT_COVER",
    "ANNOTATED_EDITION",
    "SIGNED_BY_ILLUSTRATOR",
    "MAP_INSERT",
    "SUPPLEMENTARY_MATERIALS",
    "EXCLUSIVE_CONTENT",
    "FAN_ART_EDITION",
    "INTERACTIVE_ELEMENTS",
    "BILINGUAL_EDITION",
  ]),
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = createSpecialDescriptionRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: parsedData.data.postId },
    });
    if (!post) {
      return NextResponse.json({ error: `Post with id ${parsedData.data.postId} not found` }, { status: 404 });
    }

    const newSpecialDescription = await prisma.specialDescription.create({
      data: parsedData.data,
    });

    return NextResponse.json(newSpecialDescription, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating special description", error.stack);
    return NextResponse.json({ error: "Cannot create special description" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  try {
    const specialDescriptions = await prisma.specialDescription.findMany({
      where: { postId },
    });

    return NextResponse.json(specialDescriptions);
  } catch (error) {
    if (error instanceof Error) console.error("Error getting special descriptions", error.stack);
    return NextResponse.json({ error: "Cannot get special descriptions" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const parsedData = deleteSpecialDescriptionRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const specialDescription = await prisma.specialDescription.findUnique({
      where: {
        postId_specialType: {
          postId: parsedData.data.postId,
          specialType: parsedData.data.specialType,
        },
      },
    });
    if (!specialDescription) {
      return NextResponse.json({ error: `Special description not found for postId ${parsedData.data.postId} and specialType ${parsedData.data.specialType}` }, { status: 404 });
    }

    await prisma.specialDescription.delete({
      where: {
        postId_specialType: {
          postId: parsedData.data.postId,
          specialType: parsedData.data.specialType,
        },
      },
    });

    return NextResponse.json({ message: "Special description deleted successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error("Error deleting special description", error.stack);
    return NextResponse.json({ error: "Cannot delete special description" }, { status: 500 });
  }
}