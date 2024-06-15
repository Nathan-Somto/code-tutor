import { ZodSchema, ZodError } from "zod";
import { BadRequestError } from "../errors/httpErrors";

export function zodValidator<T>(schema: ZodSchema<T>, data: unknown): T {
  const validation = schema.safeParse(data);
  if (!validation.success) {
    throw new BadRequestError(JSON.stringify(validation.error.format()));
  }
  return validation.data;
}