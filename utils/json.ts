import type { Prisma } from "@prisma/client";

/** Narrows an arbitrary object (e.g. parsed from an LLM's JSON response) to a Prisma JSON input value. */
export function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
