// @ts-check

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PaymentMethod, PrismaClient, ShipmentMethod, TransactionFailType, TransactionStatus } from "@prisma/client";
import { hash } from "bcrypt";
import fs from "fs";
import { basename } from "path";
import { z } from "zod";

import booksData from "./books.json" with { type: "json" };
import postsData from "./posts.json" with { type: "json" };
import sellerProfilesData from "./sellerProfiles.json" with { type: "json" };
import transactionsData from "./transactions.json" with { type: "json" };
import transactionsFailData from "./transactionsFail.json" with { type: "json" };
import usersData from "./users.json" with { type: "json" };

const prisma = new PrismaClient();

const awsEnvSchema = z.object({
  AWS_ENDPOINT: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_BUCKET_NAME: z.string(),
});

const awsEnv = awsEnvSchema.parse(process.env);

const s3 = new S3Client({
  endpoint: awsEnv.AWS_ENDPOINT,
  region: awsEnv.AWS_REGION,
  credentials: {
    accessKeyId: awsEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: awsEnv.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: !!awsEnv.AWS_ENDPOINT,
});

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
      Bucket: awsEnv.AWS_BUCKET_NAME,
      Key: `${folder}/${Date.now()}-${fileName}`,
      Body: buffer,
      ContentType: fileContentType,
    };

    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    const data = await upload.done();

    return data.Key;
  } catch (error) {
    console.error("Error uploading file", error);
    throw new Error("Cannot upload file");
  }
};

const users = await prisma.user.findMany();
if (users.length === 0) {
  const userInsertValues = usersData.map(async (user) => ({
    ...user,
    password: await hash(user.password, 10),
  }));

  await prisma.user.createMany({
    data: await Promise.all(userInsertValues),
  });

  console.log("Users seeded successfully");
}

const sellerProfiles = await prisma.sellerProfile.findMany();
if (sellerProfiles.length === 0) {
  const sellerProfileWithKey = await Promise.all(
    sellerProfilesData.map(async (sellerProfile) => {
      const keyWithFolder = await uploadToBucket("idCard_images", sellerProfile.idCardImage);
      const key = keyWithFolder?.split("/")[1] ?? "";
      return {
        id: sellerProfile.id,
        idCardNumber: sellerProfile.idCardNumber,
        idCardImageKey: key,
        bankAccount: sellerProfile.bankAccount,
        bankName: sellerProfile.bankName,
        isApproved: sellerProfile.isApproved,
        approvedAt: sellerProfile.approvedAt,
        userId: sellerProfile.userId,
      };
    })
  );

  await prisma.sellerProfile.createMany({
    data: sellerProfileWithKey,
  });
}

const books = await prisma.book.findMany();
if (books.length === 0) {
  const bookImageKeys = new Map();
  const booksDataWithKey = await Promise.all(
    booksData.map(async (book) => {
      let key;
      const normalizedPath = book.coverImagePath.split("/").slice(-1)[0];
      if (bookImageKeys.has(normalizedPath)) {
        key = bookImageKeys.get(normalizedPath);
      } else {
        bookImageKeys.set(
          normalizedPath,
          uploadToBucket("book_images", book.coverImagePath).then((keyWithFolder) => {
            const extractedKey = keyWithFolder?.split("/")[1] ?? "";
            bookImageKeys.set(normalizedPath, extractedKey);
            return extractedKey;
          })
        );
      }

      key = await bookImageKeys.get(normalizedPath);

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        isbn: book.isbn,
        pages: book.pages,
        publisher: book.publisher,
        coverImageKey: key,
      };
    })
  );

  await prisma.book.createMany({
    data: booksDataWithKey,
  });
  console.log("Books seeded successfully");
}

const posts = await prisma.post.findMany();
if (posts.length === 0) {
  await prisma.post.createMany({
    data: postsData,
  });
  console.log("Posts seeded successfully");
}

const transactions = await prisma.transaction.findMany();
if (transactions.length === 0) {
  await prisma.transaction.createMany({
    data: transactionsData.map((entry) => ({
      ...entry,
      status:
        (entry.status == "APPROVING" && TransactionStatus.APPROVING) ||
        (entry.status == "PAYING" && TransactionStatus.PAYING) ||
        (entry.status == "PACKING" && TransactionStatus.PACKING) ||
        (entry.status == "DELIVERING" && TransactionStatus.DELIVERING) ||
        (entry.status == "COMPLETE" && TransactionStatus.COMPLETE) ||
        (entry.status == "HOLD" && TransactionStatus.HOLD) ||
        (entry.status == "FAIL" && TransactionStatus.FAIL) ||
        TransactionStatus.APPROVING,
      paymentMethod:
        (entry.paymentMethod == "CREDIT_CARD" && PaymentMethod.CREDIT_CARD) ||
        (entry.paymentMethod == "ONLINE_BANKING" && PaymentMethod.ONLINE_BANKING) ||
        PaymentMethod.UNDEFINED,
      shipmentMethod:
        (entry.shipmentMethod == "STANDARD" && ShipmentMethod.STANDARD) ||
        (entry.shipmentMethod == "EXPRESS" && ShipmentMethod.EXPRESS) ||
        ShipmentMethod.UNDEFINED,
    })),
  });
  console.log("Transaction seeded successful");
}

const transactionsFail = await prisma.transactionFail.findMany();
if (transactionsFail.length === 0) {
  await prisma.transactionFail.createMany({
    data: transactionsFailData.map((entry) => ({
      ...entry,
      failType:
        (entry.failType == "UNDELIVERED" && TransactionFailType.UNDELIVERED) ||
        (entry.failType == "UNQUALIFIED" && TransactionFailType.UNQUALIFIED) ||
        (entry.failType == "REJECT" && TransactionFailType.REJECT) ||
        (entry.failType == "TERMINATION" && TransactionFailType.TERMINATION) ||
        (entry.failType == "OTHER" && TransactionFailType.OTHER) ||
        TransactionFailType.UNDEFINED,
    })),
  });
  console.log("TransctionFail seeded successful");
}
