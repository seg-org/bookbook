import { z } from "zod";

export const SpecialDescriptionType = z.enum([
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
  ]);
  
export type SpecialDescriptionType = z.infer<typeof SpecialDescriptionType>;