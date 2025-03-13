-- CreateEnum
CREATE TYPE "SpecialDescriptionType" AS ENUM ('author_signature', 'limited_edition', 'first_edition', 'special_cover_art', 'illustrated_edition', 'collectors_edition', 'slipcase_edition', 'leather_bound', 'gilded_edges', 'deckle_edges', 'pop_up_elements', 'fold_out_pages', 'handwritten_notes_by_author', 'personalized_message', 'numbered_edition', 'exclusive_artwork', 'embossed_cover', 'gold_foil_stamping', 'box_set', 'anniversary_edition', 'hardcover_with_dust_jacket', 'transparent_cover', 'annotated_edition', 'signed_by_illustrator', 'map_insert', 'supplementary_materials', 'exclusive_content', 'fan_art_edition', 'interactive_elements', 'bilingual_edition');

-- CreateEnum
CREATE TYPE "GenreType" AS ENUM ('fiction', 'non_fiction', 'mystery', 'thriller', 'romance', 'science_fiction', 'fantasy', 'historical_fiction', 'horror', 'biography', 'memoir', 'self_help', 'health_wellness', 'psychology', 'poetry', 'drama', 'adventure', 'childrens_literature', 'young_adult', 'graphic_novels_comics', 'crime', 'true_crime', 'dystopian', 'contemporary', 'religious_spiritual');

-- CreateEnum
CREATE TYPE "BookTagType" AS ENUM ('bestseller', 'new_release', 'classic', 'award_winning', 'must_read', 'highly_recommended', 'inspirational', 'coming_of_age', 'family_saga', 'historical', 'dark_fantasy', 'detective', 'lgbtq_plus', 'young_adult', 'childrens_book', 'short_stories', 'mystery', 'self_help', 'thriller', 'romantic_comedy');

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "bookGenres" "GenreType"[],
ADD COLUMN     "bookTags" "BookTagType"[];

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "damageURLs" TEXT[],
ADD COLUMN     "specialDescriptions" "SpecialDescriptionType"[];
