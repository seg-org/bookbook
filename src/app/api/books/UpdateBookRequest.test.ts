import { describe, expect, test } from "@jest/globals";

import { UpdateBookRequest } from "./schemas";

describe("UpdateBookRequest schema", () => {
  const validData = {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "The Hobbit is a fantasy novel by J.R.R. Tolkien",
    isbn: "9783161484100",
    pages: 310,
    coverImageKey: "the-hobbit.jpg",
    bookGenres: ["FANTASY", "ADVENTURE"],
    bookTags: ["BESTSELLER"],
    verifiedStatus: "UNVERIFIED",
    recommendPrice: 299.99,
  };

  test("passes with full valid data", () => {
    expect(() => UpdateBookRequest.parse(validData)).not.toThrow();
  });

  test("passes with empty object (all fields optional)", () => {
    expect(() => UpdateBookRequest.parse({})).not.toThrow();
  });

  test("fails when 'pages' is negative", () => {
    expect(() => UpdateBookRequest.parse({ pages: -5 })).toThrow(/Number must be greater than or equal to 0/);
  });

  test("fails with wrong type for 'title'", () => {
    expect(() => UpdateBookRequest.parse({ title: 123 })).toThrow(/Expected string/);
  });

  test("fails with wrong type for 'pages'", () => {
    expect(() => UpdateBookRequest.parse({ pages: "three hundred" })).toThrow(/Expected number/);
  });

  test("fails with wrong enum in bookGenres", () => {
    expect(() => UpdateBookRequest.parse({ bookGenres: ["UNKNOWN_GENRE"] })).toThrow(/Invalid enum value/);
  });

  test("fails with wrong enum in bookTags", () => {
    expect(() => UpdateBookRequest.parse({ bookTags: ["NOT_A_TAG"] })).toThrow(/Invalid enum value/);
  });

  test("fails if recommendPrice is negative", () => {
    expect(() => UpdateBookRequest.parse({ recommendPrice: -1 })).toThrow(/Number must be greater than or equal to 0/);
  });

  test("passes with only required fields and some optional ones missing", () => {
    const data = {
      title: "The Hobbit",
      pages: 310,
      bookGenres: ["FANTASY"],
      recommendPrice: 299.99,
    };
    expect(() => UpdateBookRequest.parse(data)).not.toThrow();
  });

  test("passes with some optional fields missing (author and coverImageKey)", () => {
    const data = {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "9783161484100",
      pages: 310,
      bookGenres: ["FANTASY", "ADVENTURE"],
      recommendPrice: 299.99,
    };
    expect(() => UpdateBookRequest.parse(data)).not.toThrow();
  });

  test("fails when bookGenres is not an array", () => {
    expect(() => UpdateBookRequest.parse({ bookGenres: "FANTASY" })).toThrow(/Expected array/);
  });

  test("fails when bookTags is not an array", () => {
    expect(() => UpdateBookRequest.parse({ bookTags: "BESTSELLER" })).toThrow(/Expected array/);
  });

  test("passes with valid bookGenres and multiple values", () => {
    const data = { bookGenres: ["FANTASY", "ADVENTURE"] };
    expect(() => UpdateBookRequest.parse(data)).not.toThrow();
  });

  test("passes with valid bookTags and multiple values", () => {
    const data = { bookTags: ["BESTSELLER", "NEW_RELEASE"] };
    expect(() => UpdateBookRequest.parse(data)).not.toThrow();
  });

  test("fails when 'bookGenres' has invalid enum value", () => {
    expect(() => UpdateBookRequest.parse({ bookGenres: ["UNKNOWN_GENRE"] })).toThrow(/Invalid enum value/);
  });

  test("fails when 'bookTags' has invalid enum value", () => {
    expect(() => UpdateBookRequest.parse({ bookTags: ["INVALID_TAG"] })).toThrow(/Invalid enum value/);
  });

  test("passes with valid ISBN", () => {
    const data = { isbn: "9783161484100" };
    expect(() => UpdateBookRequest.parse(data)).not.toThrow();
  });

  test("fails when 'isbn' is not a string", () => {
    expect(() => UpdateBookRequest.parse({ isbn: 9783161484100 })).toThrow(/Expected string/);
  });
});
