import { z } from "zod";

export const GenreType = z.enum([
  "FICTION",
  "NON_FICTION",
  "MYSTERY",
  "THRILLER",
  "ROMANCE",
  "SCIENCE_FICTION",
  "FANTASY",
  "HISTORICAL_FICTION",
  "HORROR",
  "BIOGRAPHY",
  "MEMOIR",
  "SELF_HELP",
  "HEALTH_WELLNESS",
  "PSYCHOLOGY",
  "POETRY",
  "DRAMA",
  "ADVENTURE",
  "CHILDRENS_LITERATURE",
  "YOUNG_ADULT",
  "GRAPHIC_NOVELS_COMICS",
  "CRIME",
  "TRUE_CRIME",
  "DYSTOPIAN",
  "CONTEMPORARY",
  "RELIGIOUS_SPIRITUAL",
]);

export const BookTagType = z.enum([
  "BESTSELLER",
  "NEW_RELEASE",
  "CLASSIC",
  "AWARD_WINNING",
  "MUST_READ",
  "HIGHLY_RECOMMENDED",
  "INSPIRATIONAL",
  "COMING_OF_AGE",
  "FAMILY_SAGA",
  "HISTORICAL",
  "DARK_FANTASY",
  "DETECTIVE",
  "LGBTQ_PLUS",
  "YOUNG_ADULT",
  "CHILDRENS_BOOK",
  "SHORT_STORIES",
  "MYSTERY",
  "SELF_HELP",
  "THRILLER",
  "ROMANTIC_COMEDY",
]);

export type GenreType = z.infer<typeof GenreType>;
export type BookTagType = z.infer<typeof BookTagType>;