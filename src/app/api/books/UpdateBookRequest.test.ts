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

  // ✅ Full valid data (happy path)
  test("passes with full valid data", () => {
    expect(() => UpdateBookRequest.parse(validData)).not.toThrow();
  });

  // ✅ Empty object (all fields optional)
  test("passes with empty object (all fields optional)", () => {
    expect(() => UpdateBookRequest.parse({})).not.toThrow();
  });

  // ❌ Pages validation (number >= 0)
  test("fails when 'pages' is negative", () => {
    expect(() => UpdateBookRequest.parse({ pages: -5 })).toThrow(/Number must be greater than or equal to 0/);
  });

  // ❌ Title should be string (type check)
  test("fails with wrong type for 'title'", () => {
    expect(() => UpdateBookRequest.parse({ title: 123 })).toThrow(/Expected string/);
  });

  // ❌ Pages should be number (type check)
  test("fails with wrong type for 'pages'", () => {
    expect(() => UpdateBookRequest.parse({ pages: "three hundred" })).toThrow(/Expected number/);
  });

  // ❌ Invalid enum value for bookGenres
  test("fails with wrong enum in bookGenres", () => {
    expect(() => UpdateBookRequest.parse({ bookGenres: ["UNKNOWN_GENRE"] })).toThrow(/Invalid enum value/);
  });

  // ❌ Invalid enum value for bookTags
  test("fails with wrong enum in bookTags", () => {
    expect(() => UpdateBookRequest.parse({ bookTags: ["NOT_A_TAG"] })).toThrow(/Invalid enum value/);
  });

  // ❌ Recommend price should be >= 0
  test("fails if recommendPrice is negative", () => {
    expect(() => UpdateBookRequest.parse({ recommendPrice: -1 })).toThrow(/Number must be greater than or equal to 0/);
  });

  // ✅ Test with optional fields missing (title, author, description, etc.)
  test("passes with only required fields and some optional ones missing", () => {
    const data = {
      title: "The Hobbit",
      pages: 310,
      bookGenres: ["FANTASY"],
      recommendPrice: 299.99,
    };
    expect(() => UpdateBookRequest.parse(data)).not.toThrow();
  });

  // ✅ Test with some optional fields provided (but some others missing)
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

  // ❌ When bookGenres is not an array (validation)
  test("fails when bookGenres is not an array", () => {
    expect(() => UpdateBookRequest.parse({ bookGenres: "FANTASY" })).toThrow(/Expected array/);
  });

  // ❌ When bookTags is not an array (validation)
  test("fails when bookTags is not an array", () => {
    expect(() => UpdateBookRequest.parse({ bookTags: "BESTSELLER" })).toThrow(/Expected array/);
  });

  // ✅ Valid bookGenres with multiple valid values (happy path)
  test("passes with valid bookGenres and multiple values", () => {
    const data = { bookGenres: ["FANTASY", "ADVENTURE"] };
    expect(() => UpdateBookRequest.parse(data)).not.toThrow();
  });

  // ✅ Valid bookTags with multiple valid values (happy path)
  test("passes with valid bookTags and multiple values", () => {
    const data = { bookTags: ["BESTSELLER", "NEW_RELEASE"] };
    expect(() => UpdateBookRequest.parse(data)).not.toThrow();
  });

  // ❌ Invalid bookGenres as enum (validation for invalid values)
  test("fails when 'bookGenres' has invalid enum value", () => {
    expect(() => UpdateBookRequest.parse({ bookGenres: ["UNKNOWN_GENRE"] })).toThrow(/Invalid enum value/);
  });

  // ❌ Invalid bookTags as enum (validation for invalid values)
  test("fails when 'bookTags' has invalid enum value", () => {
    expect(() => UpdateBookRequest.parse({ bookTags: ["INVALID_TAG"] })).toThrow(/Invalid enum value/);
  });

  // ✅ Valid `isbn` string (valid case)
  test("passes with valid ISBN", () => {
    const data = { isbn: "9783161484100" };
    expect(() => UpdateBookRequest.parse(data)).not.toThrow();
  });

  // ❌ Invalid `isbn` type (string expected)
  test("fails when 'isbn' is not a string", () => {
    expect(() => UpdateBookRequest.parse({ isbn: 9783161484100 })).toThrow(/Expected string/);
  });
});
