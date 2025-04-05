import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { getUrl } from "../objects/s3";
import { BookResponse, BooksResponse, CreateBookRequest } from "./schemas";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const seller = await prisma.sellerProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });
  if (!seller && !session.user.isAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const parsedData = CreateBookRequest.safeParse(await req.json());
    if (!parsedData.success) {
      console.error("Error parsing book data", parsedData.error);
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const data = {
      ...parsedData.data,
      bookGenres: parsedData.data.bookGenres ?? [],
      bookTags: parsedData.data.bookTags ?? [],
    };

    const newBook = await prisma.book.create({ data });
    const newBookWithImageUrl = {
      ...newBook,
      coverImageUrl: getUrl("book_images", newBook.coverImageKey),
    };

    return NextResponse.json(BookResponse.parse(newBookWithImageUrl), { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating book", error.stack);
    return NextResponse.json({ error: "Cannot create a book" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const title = searchParams.get("title");

    const books = await prisma.book.findMany(
      title
        ? {
            where: {
              title: {
                contains: title,
                mode: "insensitive",
              },
            },
          }
        : undefined,
    );
    const booksWithImageUrl = books.map((book) => {
      const url = getUrl("book_images", book.coverImageKey);
      return {
        ...book,
        coverImageUrl: url,
      };
    });

    return NextResponse.json(BooksResponse.parse(booksWithImageUrl));
  } catch (error) {
    if (error instanceof Error) console.error("Error getting books", error.stack);
    return NextResponse.json({ error: "Cannot get books" }, { status: 500 });
  }
}
