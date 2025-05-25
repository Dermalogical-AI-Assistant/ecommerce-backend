import { Prisma } from "@prisma/client";

export const filterString = (
    search?: string,
    mode: Prisma.QueryMode = Prisma.QueryMode.insensitive,
): Prisma.StringFilter | undefined => {
    if (search) {
        return { contains: search, mode };
    }
    return undefined;
};

export const isValidUrl = (str: string): boolean => {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
};

export const getCapitalizedWord = (str: string) => {
  return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
};
