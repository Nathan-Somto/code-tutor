const {commandMap, supportedLanguages} = require("./instructions")
const {createCodeFile} = require("../file-system/createCodeFile")
const {removeCodeFile} = require("../file-system/removeCodeFile")
const {info} = require("./info")

const {spawn} = require("child_process");

async function runCode({language = "", code = "", input = ""}) {
    const timeout = 5;
    console.log(language,code,input);
    if (code === "")
        throw {
            status: 400,
            error: "No Code found to execute."
        }

    if (language !== 'py')
        throw {
            status: 400,
            error: `only python is supported`
        }

    const {jobID} = await createCodeFile(language, code);
    const {compileCodeCommand, compilationArgs, executeCodeCommand, executionArgs, outputExt} = commandMap(jobID, language);
        // handles the compilation of code
        // resolves an empty promise if successful.
    if (compileCodeCommand) {
        await new Promise((resolve, reject) => {
            const compileCode = spawn(compileCodeCommand, compilationArgs || [])
            compileCode.stderr.on('data', (error) => {
                reject({
                    status: 200,
                    output: '',
                    error: error.toString(),
                    language
                })
            });
            compileCode.on('exit', () => {
                resolve()
            })
        })
    }

    const result = await new Promise((resolve, reject) => {
        const executeCode = spawn(executeCodeCommand, executionArgs || []);
        var output = "", error = "";
        //console.log("the execute code", executeCode);
        const timer = setTimeout(async () => {
                try{
                console.log("in set time out function");
                console.log("output in set Time out",output);
                executeCode.kill("SIGKILL");
                await removeCodeFile(jobID, language, outputExt);
                    
                return reject({
                    output,
                    status: 200,
                    error: `Code took too long to execute after ${timeout}`
                })
            }
            catch(err){
                console.log(err.message)
            }
        }, timeout * 1000);

        if (input !== "") {
            input.split('\n').forEach((line) => {
                executeCode.stdin.write(`${line}\n`);
            });
            executeCode.stdin.end();
        }

        executeCode.stdin.on('error', (err) => {
            console.log('stdin err', err);
        });

        executeCode.stdout.on('data', (data) => {
            output += data.toString();
        });

        executeCode.stderr.on('data', (data) => {
            error += data.toString();
        });

        executeCode.on('exit', (err) => {
            clearTimeout(timer);
            resolve({output, error});
        });
    })

    await removeCodeFile(jobID, language, outputExt);

    return {
        ...result,
        language,
        info: await info(language)
    }
}

module.exports = {runCode}