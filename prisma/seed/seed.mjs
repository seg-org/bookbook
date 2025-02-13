// @ts-check

import { PaymentMethod, PrismaClient, ShipmentMethod, TransactionFailType, TransactionStatus } from "@prisma/client";
import AWS from "aws-sdk";
import { hash } from "bcrypt";
import fs from "fs";
import { basename } from "path";
import booksData from "./books.json" with { type: "json" };
import postsData from "./posts.json" with { type: "json" };
import sellerProfilesData from "./sellerProfiles.json" with { type: "json" };
import transactionsData from "./transactions.json" with { type: "json" };
import transactionsFailData from "./transactionsFail.json" with { type: "json" };
import usersData from "./users.json" with { type: "json" };

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

const users = await prisma.user.findMany();
if (users.length === 0) {
  usersData.forEach(async (user) => {
    const hashedPassword = await hash(user.password, 10);
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  });
  console.log("Users seeded successfully");
}

const sellerProfiles = await prisma.sellerProfile.findMany();
if (sellerProfiles.length === 0) {
  const sellerProfileWithKey = await Promise.all(
    sellerProfilesData.map(async (sellerProfile) => {
      const keyWithFolder = await uploadToBucket("idCard_images", sellerProfile.idCardImage);
      const key = keyWithFolder.split("/")[1];
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
            const extractedKey = keyWithFolder.split("/")[1];
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
        coverImageKey: key,
        sellerId: book.sellerId,
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
        (entry.status == "VERIFYING" && TransactionStatus.VERIFYING) ||
        (entry.status == "COMPLETE" && TransactionStatus.COMPLETE) ||
        (entry.status == "FAIL" && TransactionStatus.FAIL) ||
        TransactionStatus.APPROVING,
      paymentMethod:
        (entry.paymentMethod == "CREDIT_CARD" && PaymentMethod.CREDIT_CARD) ||
        (entry.paymentMethod == "ONLINE_BANKING" && PaymentMethod.ONLINE_BANKING) ||
        PaymentMethod.CREDIT_CARD,
      shipmentMethod: (entry.shipmentMethod == "DELIVERY" && ShipmentMethod.DELIVERY) || ShipmentMethod.DELIVERY,
    })),
  });
  console.log("Transaction seeded successful");
}

const transactionsFail = await prisma.transactionFail.findMany();
if (transactionsFail.length === 0) {
  await prisma.transactionFail.createMany({
    data: transactionsFailData.map((entry) => ({
      ...entry,
      failType: (entry.failType == "CHEAT" && TransactionFailType.CHEAT) || TransactionFailType.CHEAT,
    })),
  });
  console.log("TransctionFail seeded successful");
}
