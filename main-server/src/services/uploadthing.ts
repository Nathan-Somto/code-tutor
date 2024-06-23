import { createUploadthing, type FileRouter } from "uploadthing/express";
 
const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    console.log("  - Above error caused by:", err.cause);

    return { message: err.message };
  }
}
  ,
);
 
export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 2,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
    return data;
  }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof uploadRouter;