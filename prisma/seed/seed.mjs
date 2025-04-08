// @ts-check

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  BookTagType,
  DamageType,
  GenreType,
  PaymentMethod,
  PrismaClient,
  ShipmentMethod,
  SpecialDescriptionType,
  TransactionFailType,
  TransactionStatus,
} from "@prisma/client";
import { hash } from "bcrypt";
import fs from "fs";
import { basename } from "path";
import { z } from "zod";

import booksData from "./books.json" with { type: "json" };
import chatMessagesData from "./chatMessages.json" with { type: "json" };
import chatReportsData from "./chatReports.json" with { type: "json" };
import chatRoomsData from "./chatRooms.json" with { type: "json" };
import postsData from "./posts.json" with { type: "json" };
import reviewsData from "./reviews.json" with { type: "json" };
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
        description: book.description,
        isbn: book.isbn,
        pages: book.pages,
        publisher: book.publisher,
        coverImageKey: key,
        bookGenres: book.bookGenres.map(
          (genre) =>
            (genre == "FICTION" && GenreType.FICTION) ||
            (genre == "NON_FICTION" && GenreType.NON_FICTION) ||
            (genre == "MYSTERY" && GenreType.MYSTERY) ||
            (genre == "THRILLER" && GenreType.THRILLER) ||
            (genre == "ROMANCE" && GenreType.ROMANCE) ||
            (genre == "SCIENCE_FICTION" && GenreType.SCIENCE_FICTION) ||
            (genre == "FANTASY" && GenreType.FANTASY) ||
            (genre == "HISTORICAL_FICTION" && GenreType.HISTORICAL_FICTION) ||
            (genre == "HORROR" && GenreType.HORROR) ||
            (genre == "BIOGRAPHY" && GenreType.BIOGRAPHY) ||
            (genre == "MEMOIR" && GenreType.MEMOIR) ||
            (genre == "SELF_HELP" && GenreType.SELF_HELP) ||
            (genre == "HEALTH_WELLNESS" && GenreType.HEALTH_WELLNESS) ||
            (genre == "PSYCHOLOGY" && GenreType.PSYCHOLOGY) ||
            (genre == "POETRY" && GenreType.POETRY) ||
            (genre == "DRAMA" && GenreType.DRAMA) ||
            (genre == "ADVENTURE" && GenreType.ADVENTURE) ||
            (genre == "CHILDRENS_LITERATURE" && GenreType.CHILDRENS_LITERATURE) ||
            (genre == "YOUNG_ADULT" && GenreType.YOUNG_ADULT) ||
            (genre == "GRAPHIC_NOVELS_COMICS" && GenreType.GRAPHIC_NOVELS_COMICS) ||
            (genre == "CRIME" && GenreType.CRIME) ||
            (genre == "TRUE_CRIME" && GenreType.TRUE_CRIME) ||
            (genre == "CONTEMPORARY" && GenreType.CONTEMPORARY) ||
            (genre == "RELIGIOUS_SPIRITUAL" && GenreType.RELIGIOUS_SPIRITUAL) ||
            GenreType.NON_FICTION
        ),
        bookTags: book.bookTags.map(
          (tag) =>
            (tag == "BESTSELLER" && BookTagType.BESTSELLER) ||
            (tag == "NEW_RELEASE" && BookTagType.NEW_RELEASE) ||
            (tag == "CLASSIC" && BookTagType.CLASSIC) ||
            (tag == "AWARD_WINNING" && BookTagType.AWARD_WINNING) ||
            (tag == "MUST_READ" && BookTagType.MUST_READ) ||
            (tag == "HIGHLY_RECOMMENDED" && BookTagType.HIGHLY_RECOMMENDED) ||
            (tag == "INSPIRATIONAL" && BookTagType.INSPIRATIONAL) ||
            (tag == "COMING_OF_AGE" && BookTagType.COMING_OF_AGE) ||
            (tag == "FAMILY_SAGA" && BookTagType.FAMILY_SAGA) ||
            (tag == "HISTORICAL" && BookTagType.HISTORICAL) ||
            (tag == "DARK_FANTASY" && BookTagType.DARK_FANTASY) ||
            (tag == "DETECTIVE" && BookTagType.DETECTIVE) ||
            (tag == "LGBTQ_PLUS" && BookTagType.LGBTQ_PLUS) ||
            (tag == "YOUNG_ADULT" && BookTagType.YOUNG_ADULT) ||
            (tag == "CHILDRENS_BOOK" && BookTagType.CHILDRENS_BOOK) ||
            (tag == "SHORT_STORIES" && BookTagType.SHORT_STORIES) ||
            (tag == "MYSTERY" && BookTagType.MYSTERY) ||
            (tag == "SELF_HELP" && BookTagType.SELF_HELP) ||
            (tag == "THRILLER" && BookTagType.THRILLER) ||
            (tag == "ROMANTIC_COMEDY" && BookTagType.ROMANTIC_COMEDY) ||
            BookTagType.BESTSELLER
        ),
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
    data: postsData.map((entry) => ({
      ...entry,
      specialDescriptions: entry.specialDescriptions.map(
        (desc) =>
          (desc == "AUTHOR_SIGNATURE" && SpecialDescriptionType.AUTHOR_SIGNATURE) ||
          (desc == "LIMITED_EDITION" && SpecialDescriptionType.LIMITED_EDITION) ||
          (desc == "FIRST_EDITION" && SpecialDescriptionType.FIRST_EDITION) ||
          (desc == "SPECIAL_COVER_ART" && SpecialDescriptionType.SPECIAL_COVER_ART) ||
          (desc == "ILLUSTRATED_EDITION" && SpecialDescriptionType.ILLUSTRATED_EDITION) ||
          (desc == "COLLECTORS_EDITION" && SpecialDescriptionType.COLLECTORS_EDITION) ||
          (desc == "SLIPCASE_EDITION" && SpecialDescriptionType.SLIPCASE_EDITION) ||
          (desc == "LEATHER_BOUND" && SpecialDescriptionType.LEATHER_BOUND) ||
          (desc == "GILDED_EDGES" && SpecialDescriptionType.GILDED_EDGES) ||
          (desc == "DECKLE_EDGES" && SpecialDescriptionType.DECKLE_EDGES) ||
          (desc == "POP_UP_ELEMENTS" && SpecialDescriptionType.POP_UP_ELEMENTS) ||
          (desc == "FOLD_OUT_PAGES" && SpecialDescriptionType.FOLD_OUT_PAGES) ||
          (desc == "HANDWRITTEN_NOTES_BY_AUTHOR" && SpecialDescriptionType.HANDWRITTEN_NOTES_BY_AUTHOR) ||
          (desc == "PERSONALIZED_MESSAGE" && SpecialDescriptionType.PERSONALIZED_MESSAGE) ||
          (desc == "NUMBERED_EDITION" && SpecialDescriptionType.NUMBERED_EDITION) ||
          (desc == "EXCLUSIVE_ARTWORK" && SpecialDescriptionType.EXCLUSIVE_ARTWORK) ||
          (desc == "EMBOSSED_COVER" && SpecialDescriptionType.EMBOSSED_COVER) ||
          (desc == "GOLD_FOIL_STAMPING" && SpecialDescriptionType.GOLD_FOIL_STAMPING) ||
          (desc == "BOX_SET" && SpecialDescriptionType.BOX_SET) ||
          (desc == "ANNIVERSARY_EDITION" && SpecialDescriptionType.ANNIVERSARY_EDITION) ||
          (desc == "HARDCOVER_WITH_DUST_JACKET" && SpecialDescriptionType.HARDCOVER_WITH_DUST_JACKET) ||
          (desc == "TRANSPARENT_COVER" && SpecialDescriptionType.TRANSPARENT_COVER) ||
          (desc == "ANNOTATED_EDITION" && SpecialDescriptionType.ANNOTATED_EDITION) ||
          (desc == "SIGNED_BY_ILLUSTRATOR" && SpecialDescriptionType.SIGNED_BY_ILLUSTRATOR) ||
          (desc == "MAP_INSERT" && SpecialDescriptionType.MAP_INSERT) ||
          (desc == "SUPPLEMENTARY_MATERIALS" && SpecialDescriptionType.SUPPLEMENTARY_MATERIALS) ||
          (desc == "EXCLUSIVE_CONTENT" && SpecialDescriptionType.EXCLUSIVE_CONTENT) ||
          (desc == "FAN_ART_EDITION" && SpecialDescriptionType.FAN_ART_EDITION) ||
          (desc == "INTERACTIVE_ELEMENTS" && SpecialDescriptionType.INTERACTIVE_ELEMENTS) ||
          (desc == "BILINGUAL_EDITION" && SpecialDescriptionType.BILINGUAL_EDITION) ||
          SpecialDescriptionType.BILINGUAL_EDITION
      ),
      damage:
        (entry.damage == "NO_DAMAGED" && DamageType.NO_DAMAGED) ||
        (entry.damage == "SLIGHTLY_DAMAGED" && DamageType.SLIGHTLY_DAMAGED) ||
        (entry.damage == "DAMAGED" && DamageType.DAMAGED) ||
        DamageType.NO_DAMAGED,
      createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
    })),
  });
  console.log("Posts seeded successfully");
}

const chatRooms = await prisma.chatRoom.findMany();
if (chatRooms.length === 0) {
  await prisma.chatRoom.createMany({
    data: chatRoomsData,
  });
  console.log("chatRooms seeded successfully");
}

const chatMessages = await prisma.chatMessage.findMany();
if (chatMessages.length === 0) {
  await prisma.chatMessage.createMany({
    data: chatMessagesData,
  });
  console.log("chatMessages seeded successfully");
}

const chatReports = await prisma.chatReport.findMany();
if (chatReports.length === 0) {
  await prisma.chatReport.createMany({
    data: chatReportsData,
  });
  console.log("chatReports seeded successfully");
}

const transactions = await prisma.transaction.findMany();
if (transactions.length === 0) {
  await prisma.transaction.createMany({
    data: transactionsData.map((entry) => ({
      ...entry,
      status:
        (entry.status == "PACKING" && TransactionStatus.PACKING) ||
        (entry.status == "DELIVERING" && TransactionStatus.DELIVERING) ||
        (entry.status == "COMPLETE" && TransactionStatus.COMPLETE) ||
        (entry.status == "HOLD" && TransactionStatus.HOLD) ||
        (entry.status == "FAIL" && TransactionStatus.FAIL) ||
        TransactionStatus.PACKING,
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

const reviews = await prisma.review.findMany();
if (reviews.length === 0) {
  await prisma.review.createMany({
    data: reviewsData.map((entry) => ({
      ...entry,
    })),
  });
  console.log("Review seeded successful");
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
