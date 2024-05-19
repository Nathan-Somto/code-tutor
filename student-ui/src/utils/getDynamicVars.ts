export function getDynamicVars(question: string): number[]{
    // takes a question string and returns all the dynamic variables numbers as an array.
    const vars = question.match(/\${[0-9]+}+/g);
    if(vars !== null){ 
     return vars.join(' ').match(/[0-9]+/g)?.map(item => +item) ?? []
    }
    return []  
  }