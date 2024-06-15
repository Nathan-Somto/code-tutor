
        import {Request, Response} from "express";
        const createlevel = async (req:Request, res:Response)=>
        {
            try{
                res.json({message: "created level"});
            }
            catch(err){
                console.log(err);
            }
        };
        export {
            createlevel
        }