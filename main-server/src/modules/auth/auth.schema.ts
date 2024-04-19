//write your schema validation here
import * as z from "zod";
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  profile_photo: z.string().optional(),
  dob: z.date(),
  password: z.string(),
});
const studentSchema = z.object({
  ...userSchema.shape,
  username: z.string().min(5).max(24),
  programme: z.string()
});
const teacherSchema = z.object({
  ...userSchema.shape,
  certificate: z.string()
})
type StudentSchema = z.infer<typeof studentSchema>;
type UserSchema = z.infer<typeof userSchema>;
type TeacherSchema = z.infer<typeof teacherSchema>;
export { studentSchema, teacherSchema, StudentSchema, UserSchema, TeacherSchema };
