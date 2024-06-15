import * as z from "zod";

// Zod schema equivalent to the Prisma Course model
const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url().optional(),
  creatorId: z.string(), // assuming UUID for creatorId
  contributorIds: z.array(z.string()), // array of UUIDs for contributorIds
  language: z.string().min(1, "Language is required"),
});
type courseSchema = z.infer<typeof courseSchema>;
export default courseSchema;