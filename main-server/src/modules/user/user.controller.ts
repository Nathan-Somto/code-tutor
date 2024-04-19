
        import {Request, Response} from "express";
        const createuser = async (req:Request, res:Response)=>
        {
            try{
                res.json({message: "created user"});
            }
            catch(err){
                console.log(err);
            }
        };
        export {
            createuser
        }