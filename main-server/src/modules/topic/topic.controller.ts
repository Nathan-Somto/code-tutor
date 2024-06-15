
        import {Request, Response} from "express";
        const createtopic = async (req:Request, res:Response)=>
        {
            try{
                res.json({message: "created topic"});
            }
            catch(err){
                console.log(err);
            }
        };
        export {
            createtopic
        }