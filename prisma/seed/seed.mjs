// @ts-check

import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";
import fs from "fs";
import { basename } from "path";
import booksData from "./books.json" assert { type: "json" };
import postsData from "./posts.json" assert { type: "json" };

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const prisma = new PrismaClient();
const s3 = new AWS.S3();

/**
 * Uploads a file to S3
 * @param {string} folder - The S3 folder name
 * @param {string} filePath - The local file path
 */
const uploadToBucket = async (folder, filePath) => {
  try {
    const fileName = basename(filePath);
    const buffer = fs.readFileSync(filePath);
    const fileContentType = "image/jpeg";

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: `${folder}/${Date.now()}-${fileName}`,
      Body: buffer,
      ContentType: fileContentType,
    };

    const data = await s3.upload(uploadParams).promise();

    return data.Key;
  } catch (error) {
    console.error("Error uploading file", error);
    throw new Error("Cannot upload file");
  }
};

// Check if the database is already seeded
const books = await prisma.book.findMany();
if (books.length === 0) {
  const booksDataWithKey = await Promise.all(
    booksData.map(async (book) => {
      const keyWithFolder = await uploadToBucket("book_images", book.coverImagePath);
      const key = keyWithFolder.split("/")[1];
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        isbn: book.isbn,
        pages: book.pages,
        coverImageKey: key,
        sellerId: book.sellerId,
      };
    })
  );

  await prisma.book.createMany({
    data: booksDataWithKey,
  });

  console.log("Books seeded successfully");

  const books = await prisma.book.findMany();
  const postsDataWithKey = postsData.map((post, i) => {
    return {
      ...post,
    };
  });

  await prisma.post.createMany({
    data: postsDataWithKey,
  });

  console.log("Posts seeded successfully");
}
