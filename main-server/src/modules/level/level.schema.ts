//write your schema validation here
import { $Enums } from "@prisma/client";
import * as z from "zod";
const ChallengeTypeEnum = z.enum(["FIX_THE_BUG", "ALGORITHM", "COMPLETE_CODE"]);
const TestCaseSchema = z.object({
  input: z.string().min(1),
  expectedOutput: z.string().min(1),
  description: z.string().min(1),
});

// Define schema for creating CodeChallenge
export const CreateCodeChallengeSchema = z.object({
  starterFile: z.string().min(1),
  starterCode: z.string().min(1),
  language: z.string().min(1),
  testCases: z.array(TestCaseSchema),
  challengeType: ChallengeTypeEnum,
  levelId: z.string()
});
export const CreateLessonLevelSchema = z.object({
  content:z.array(z.string().min(30)),
  levelId: z.string()
})
export type CreateLessonLevelInput = z.infer<typeof CreateLessonLevelSchema>
// Export inferred types
export type CreateCodeChallengeInput = z.infer<
  typeof CreateCodeChallengeSchema
>;
export type TestCaseInput = z.infer<typeof TestCaseSchema>;
export type ChallengeType = z.infer<typeof ChallengeTypeEnum>;
// create a zod schema for this
// question is optional when it is matching pairs
export const createQuizLevelSchema = z.object({
  question: z.string().optional(),
  answer: z.string(),
  options: z.array(z.string()),
  levelId: z.string(),
  quizType: z.enum([
    $Enums.QuizType.MULTIPLE_CHOICE,
    $Enums.QuizType.MATCHING_PAIRS,
    $Enums.QuizType.COMPLETE_SEQUENCE,
  ]),
});
export type CreateQuizLevelSchema = z.infer<typeof createQuizLevelSchema>;

const Difficulty = z.enum(["Easy", "Medium", "Hard", "Advanced", "Expert"]);
const LevelType = z.enum(["Lesson", "Quiz", "Code"]);

export const createLevelSchema = z.object({
  topicId: z.string().min(1, "Topic ID is required"),
  gems: z.number().int().min(5, "Gems must be at least 5").max(30, "Gems must be at most 30"),
  levelType: LevelType.default("Lesson"),
  xp: z.number().int().min(10, "XP must be at least 10").max(150, "XP must be at most 150"),
  mysteryLevel: z.boolean(),
  order: z.number().int().min(0, "Order must be a non-negative integer"),
  difficulty: Difficulty.default("Easy"),
  name: z.string().min(3, "level name must be at least 3 characters").max(300, "level name must be at most 300 characters"),
});

// Exporting the inferred types for use in other parts of your application
export type CreateLevelInput = z.infer<typeof createLevelSchema>;
