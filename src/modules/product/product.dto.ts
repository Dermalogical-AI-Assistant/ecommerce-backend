import { CurrencyType, SkincareConcern } from "@prisma/client";

export type IngredientAnalysis = {
  total_ingredients: number;
  text: string;
  description: string;
  ewg: Record<string, any>;
  natural: Record<string, any>;
  ingredients_table: {
    index: number;
    title: string;
    alias: string;
    id: number;
    introtext: string | null;
    cir_rating: string | null;
    boolean_properties: Record<string, boolean>;
    integer_properties: Record<string, number>;
    ewg: {
      url: string | null;
      min: number | null;
      max: number | null;
      data: string | null;
      background: string;
      decision: string;
    };
    categories: string;
  }[];
  harmful: {
    [key: string]: {
      title: string;
      description: string;
      image_url: string;
      list: {
        index: number;
        title: string;
        alias: string;
      }[];
      count: number;
      slug: string;
    };
  };
  positive: {
    [key: string]: {
      title: string;
      description: string;
      image_url: string;
      list: {
        index: number;
        title: string;
        alias: string;
      }[];
      count: number;
    };
  };
  notable: {
    [key: string]: {
      title: string;
      list: {
        index: number;
        title: string;
        alias: string;
      }[];
      count: number;
    };
  };
};

export class ImportProductDto {
  index: number;
  thumbnail?: string;
  additionalImages?: string;
  title?: string;
  price?: string;
  totalQuantity?: string;
  currency?: string;
  averageRating?: string;
  description?: string;
  howToUse?: string;
  ingredientBenefits?: string;
  fullIngredientsList?: string;
  skincareConcerns?: string;
}

export class PreprocessedImportProductDto {
  thumbnail: string;
  additionalImages?: string;
  title: string;
  price: string;
  totalQuantity: string;
  currency: string;
  averageRating?: string;
  description?: string;
  howToUse?: string;
  ingredientBenefits?: string;
  fullIngredientsList?: string;
  skincareConcerns: string;
}