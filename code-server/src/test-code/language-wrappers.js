const languageWrappers = (code="", funcCall="", input="") => ({
    'java': `
${code}

public class Test {
  public static void main(String[] args) {
    System.out.println(${funcCall}(${input}));
  }
}
`,
    'cpp': `
${code}

#include <iostream>
using namespace std;

int main() {
    cout << ${funcCall}(${input}) << endl;
    return 0;
}
`,
    'py': `
${code}

print(${funcCall}(${input}))
`,
    'c':`
${code}

#include <stdio.h>

int main() {
    printf("%d\\n", ${funcCall}(${input}));
    return 0;
}
`,
    'js':`
${code}

console.log(${funcCall}(${input}));
`,
    'go': `
${code}

package main

import "fmt"

func main() {
    fmt.Println(${funcCall}(${input}))
}
`,
    'cs':`
${code}

using System;

class Program {
    static void Main() {
        Console.WriteLine(${funcCall}(${input}));
    }
}
`
  });
module.exports = {
    languageWrappers
}

 