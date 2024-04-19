const {runCode} = require("./run-code");
const {supportedLanguages} = require("./run-code/instructions");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const {info} = require("./run-code/info");
const { testCode } = require("./test-code");
const {sendResponse} = require("./utils/sendResponse");
const {existsSync} = require("fs")
const {join} = require("path")
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());


app.get("/code-challenge/:foldername/starter-code", async(req,res) => {
    try{
        const {foldername} = req.params;
        const folderPath = join(process.cwd(),'src', 'code-challenges', foldername, 'starter.py' )
        if(existsSync(folderPath)){
           res.sendFile(folderPath)
           return;
        }
        
    }catch(err){

    }
});
app.get("/code-challenge/:foldername/challenge", async(req,res) => {
    try{
        const {foldername} = req.params;
        const folderPath = join(process.cwd(), 'src', 'code-challenges', foldername, 'challenge.md' )
        if(existsSync(folderPath)){
           res.sendFile(folderPath)
           return;
        }
       throw new Error("challenge does not exist");
    }catch(err){
        console.log(err.message);
        sendResponse(res, 500, err);
    }
})
app.post("/run-code", async (req, res) => {
    try {
        console.log("running code")
        const output = await runCode(req.body)
        sendResponse(res, 200, output)
    } catch (err) {
        sendResponse(res, err?.status || 500, err)
    }
})
app.post("/test-code/:id", async (req,res) => {
    try {
        const {code,language} = req.body;
       const {id} = req.params;
       const output = await testCode(language,code,id);
       sendResponse(res,200,output);
    }catch(err){
        sendResponse(res, err?.status || 500, err)
    }
})

app.get('/list', async (req, res) => {
    const body = []

    for(const language of supportedLanguages) {
        body.push({
            language,
            info: await info(language),
        })
    }

    sendResponse(res, 200, {supportedLanguages: body})
})

app.listen(port,()=> {
    console.log(`server started on http://localhost:${port}`)
});
