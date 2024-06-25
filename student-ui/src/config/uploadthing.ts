import {
    generateReactHelpers,
    type GenerateTypedHelpersOptions,
    
  } from "@uploadthing/react";
 /*  import { type FileRouter} from "uploadthing/express" */
 import { type FileRouter } from "uploadthing/types";
  const initOpts = {
    url: import.meta.env.VITE_MAIN_API_URL + "/uploadthing",

  } satisfies GenerateTypedHelpersOptions;

export const {  uploadFiles } = generateReactHelpers<FileRouter>(initOpts);