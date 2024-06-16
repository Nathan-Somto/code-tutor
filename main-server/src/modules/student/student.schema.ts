//write your schema validation here
import * as z from "zod";
const codeSolutionSchema = z.object({
        codeChallengeId: z.string(),
        levelId: z.string(),
        courseId: z.string(),
        answer: z.string()
})
type CodeSolution = z.infer<typeof codeSolutionSchema>

export {codeSolutionSchema, CodeSolution}