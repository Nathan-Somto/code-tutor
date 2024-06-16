const { runCode } = require("../run-code");
const {languageWrappers} = require('./language-wrappers')



async function testCode({
  language = 'py',
  code = "",
  test_cases = [],
  functionCall = undefined,
}) {
  console.log("in test code: ", test_cases);

  if (test_cases.length === 0) {
    throw {
      status: 404,
      error: "test cases for the code could not be found",
    };
  }

  

  const runSingleTest = async (test) => {
    const formattedInput = Array.isArray(test.input) ? test.input.join(', ') : test.input;
    let fullCode;
    if(!languageWrappers()[language]){
      throw {
        status: 400,
        message: `Unsupported language: ${language}`,
      };
    }
    if (functionCall) {
      fullCode = languageWrappers(code, functionCall, formattedInput)[language];
    } else {
      fullCode = code;
    }
    console.log("Executing code: ", fullCode);

    const response = await runCode({
      code: fullCode,
      language,
      input: test.input,
    });
    console.log(response)
   test.passed = response?.output?.trim() === test.expectedOutput.trim();
   test.output = output;
   delete test.input;
    if (!test.passed) {
      test.outputReceived = response?.output || response?.error;
    }

    return test;
}
const runTests = await Promise.all(test_cases.map((test) => runSingleTest(test)));

  return runTests;
}
module.exports = {testCode}