import {
    generateVueHelpers,
    type GenerateTypedHelpersOptions,
    
  } from "@uploadthing/vue";
 /*  import { type FileRouter} from "uploadthing/express" */
 import { type FileRouter } from "uploadthing/types";
  const initOpts = {
    url: import.meta.env.VITE_API_BASE_URL + "/uploadthing",

  } satisfies GenerateTypedHelpersOptions;

export const {  uploadFiles } = generateVueHelpers<FileRouter>(initOpts);