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



app.post("/run-code", async (req, res) => {
    try {
        console.log("running code")
        const output = await runCode(req.body)
        sendResponse(res, 200, output)
    } catch (err) {
        sendResponse(res, err?.status || 500, err)
    }
})
app.post("/test-code", async (req,res) => {
    try {
        const {code,language, tests, functionCall} = req.body;
       const output = await testCode({language,code,test_cases: tests, functionCall});
       console.log(output)
       sendResponse(res,200,output);
    }catch(err){
        console.log(err)
        sendResponse(res, err?.status || 500, err.message)
    }
})

app.get('/supported-languages', async (req, res) => {
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
