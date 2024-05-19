type Blocks = {
    question: string,
    code: string
}
/** 
 * @description    
 *  given a sample python  question content string
    ```js
    "What is the right way to assign a value to a variable?\n ##*variable${1}\"value\"*##"
    ```
    the function should return the question and the code block as an object
    ```js
    {
        question: "What is the right way to assign a value to a variable?\n",
        code:"variable${1}\"value\""
    }
    ```
    keywords for code blocks syntax
    ```py
    start_of_code_block = '##*'
    end_of_code_block = '*##'
    placeholder_value = '${number}'
    space_placeholder = '/-'
    ```
 */
export function extractBlocks(content: string): Blocks{
    // go through the content, wherever i encounter a ##* i will extract the code block content  and append to codeBlock string till i reach a corresponding *##
    // if i don't encounter the closing *## then it is assumed that everyhting after is a code block
    let question = "";
    let inCodeBlock = false;
    let codeBlock = "";
    for (let i = 0; i < content.length; i++){
        if (content[i] === "#" && content[i+1] === "#" && content[i+2] === "*"){
            inCodeBlock = true;
            i += 2;
            continue;
        }
        if (content[i] === "*" && content[i+1] === "#" && content[i+2] === "#"){
            inCodeBlock = false;
            i += 3;
            continue;
        }
        if (inCodeBlock){
            codeBlock += content[i];
        }
        else{
            question += content[i];
        }
    }

    return {
        question,
        code:codeBlock
    }
}

