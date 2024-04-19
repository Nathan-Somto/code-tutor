const {runCode} = require('../run-code')
// for now hard coded
const printTest = {
    id: "1234",
    description: "a simple test to check if certain values have been printed!",
    tests : [
        {
            input: "",
            description: "must contain hello world! and this is my first program",
            expectedOutput: "hello world!\nthis is my first program",
            passed: null,
        }
    ]
}
const sortingTest = {
    id: "23456",
    description: "a simple test  for sorting",
    tests : [
        {
            input: "[]",
            description: "must be an empty array",
            expectedOutput: "[]",
            passed:null,
        },
        {
            input: "[4,2,5,1,9,3]",
            description: "must be a sorted array",
            expectedOutput: "[1,2,3,4,5,9]",
            passed: null
        }
    ]
}
async function testCode({language="py", code="", id="1234"}) {
   
        let tests;
        // gets the test cases for the code,
        if(id === printTest.id){
            tests = printTest;
        }
        else if(id === sortingTest.id){
            tests = sortingTest;
        }
        else {
            throw {
                status: 404,
                error: "test cases for the code could not be found"
            }
        }
        // calls run code with the test cases, gets the output compares with test cases expected output,
   
        const runTests = tests.tests.map((test) => async () => {
            try {
                const response = await runCode({
                    code,
                    language,
                    input: test.input
                })
                test.passed = response?.result?.output === test.expectedOutput
                if(!test.passed){
                    test.outputRecieved = response?.result?.output || response?.result?.error;
                }
            }
            catch(err){
                console.error(err)
                test.passed = false;
            }
            return test;
        })
        // returns the test cases that passed or failed
       return Promise.all(runTests);
}
module.exports = {testCode}