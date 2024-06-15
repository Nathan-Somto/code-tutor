import * as fs from "fs"
import * as path from "path"
import * as readline from "node:readline"

const input = process.stdin
const output = process.stdout
// read the command line arguments for entity name
// ts-node gmf(name of file) user(entity)
let entity = process.argv[2];
if(entity === undefined){
    console.error("file name not passed");
    process.exit(1);
}

console.log("code is executing");
const rl = readline.createInterface({ input, output });
const folderPath = path.join(process.cwd().split(path.sep).slice(0, -2).join(path.sep), "src", "modules")
// check if the folder exists
if(fs.existsSync(path.join(folderPath, entity.toLowerCase()))){
    // ask the user a friendly prompt (would you like to overwrite this folder (y/n)) (default answer n which means stop execution)
   rl.question(`The folder ${entity} already exists, would you like to overwrite it? (y/n)`,(answer:string) =>{
       // if the user says yes, delete the folder
       if(answer === "y"){
           fs.rmSync((path.join(folderPath, entity.toLowerCase())), {recursive: true})
           // create the files
           createFiles(entity.toLowerCase())
       } else {
           // stop the execution
           process.exit(0)
       }

   });
    } else {
        createFiles(entity.toLowerCase());
    } 
// call the generate utility that creates these files
/** 
 *@file entity.controller.ts 
 *@file  entity.routes.ts 
 *@file  entity.test.ts
 *@file entity.schema.ts
 *@file index.ts  
 */
function createFiles(entity: string){
    try{
        fs.mkdirSync((path.join(folderPath, `${entity}`)))
        // create file called ${entity}.controller.ts
        const controllerMessage = `\"created ${entity}\"`;
        const controllerData = `
        import {Request, Response, NextFunction} from "express";
        const create${entity} = async (req:Request, res:Response, next: NextFunction)=>
        {
            try{
                res.json({message: ${controllerMessage}});
            }
            catch(err){
                next(err);
            }
        };
        export {
            create${entity}
        }`;
        fs.appendFileSync(path.join(folderPath,`${entity}`, `${entity}.controller.ts`),controllerData);
        const routesData = `
        import express from "express";
        import {create${entity}} from "./${entity}.controller";
        const router = express.Router();
        router.post('/', create${entity});
        export default router;
        `;
        fs.appendFileSync(path.join(folderPath,`${entity}`, `${entity}.routes.ts`),routesData);
        const testData = `//write your tests here`;
        fs.appendFileSync(path.join(folderPath, `${entity}`,`${entity}.tests.ts`),testData);
        const schemaData = `
        //write your schema validation here
        import * as z from "zod";
        `;
        fs.appendFileSync(path.join(folderPath, `${entity}`,`${entity}.schema.ts`),schemaData);
        const indexData = `
        import router from "./${entity}.routes";
        export default router
        `;
        fs.appendFileSync(path.join(folderPath, `${entity}`, `index.ts`),indexData);
        process.exit(0);
    }catch(err){
        console.error((err as Error)?.message);
        process.exit(1);
    }
  
}