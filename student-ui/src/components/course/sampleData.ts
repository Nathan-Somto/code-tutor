import Python from "@/assets/courses/python.png";
import CPlusPlus from "@/assets/courses/c++.png";
import C from "@/assets/courses/c.png";
import Go from "@/assets/courses/go.png";
import JS from "@/assets/courses/js.png";
import CSharp from "@/assets/courses/csharp.png";
import Java from "@/assets/courses/java.png";
export const sampleData = [
    {
      title: "Python",
      id: 1,
      completed: false,
      disabled: false,
      imgSrc: Python,
      progress: 45,
      // in markdown format with external links
      description: `Python is a high-level, interpreted, versatile programming language. Its design prioritizes code readability through significant indentation. Python is dynamically typed and features garbage collection.
  
      Explore further at the following resources:
      
      - [Official Website: Python](https://www.python.org/)
      - [Tutorial Series: How to Code in Python](https://www.python.org/about/gettingstarted/)
      - [Python Wikipedia](https://en.wikipedia.org/wiki/Python_(programming_language))
      - [Google's Python Class](https://developers.google.com/edu/python/)
      - [W3Schools - Python Tutorial](https://www.w3schools.com/python/)`,
    },
    {
      title: "C++",
      id: 2,
      completed: false,
      disabled: false,
      imgSrc: CPlusPlus,
      description: `C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language, or "C with Classes".
       The language has expanded significantly over time, and modern C++ has object-oriented, generic, 
       and functional features in addition to facilities for low-level memory manipulation.
       `,
    },
    {
      title: "C",
      id: 3,
      completed: true,
      disabled: false,
      imgSrc: C,
      progress: 100,
      description: `C is a general-purpose, procedural computer programming language supporting structured programming,
       lexical variable scope, and recursion, with a static type system. 
       By design, C provides constructs that map efficiently to typical machine instructions. 
       It has found lasting use in applications previously coded in assembly language. 
       Such applications include operating systems and various application software for computer architectures that range from supercomputers to PLCs and embedded systems.`,
    },
    {
      title: "JavaScript",
      id: 4,
      completed: false,
      disabled: false,
      imgSrc: JS,
      progress: 70,
      description: `JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification.`,
    },
    {
      title: "Java",
      id: 5,
      completed: false,
      disabled: false,
      imgSrc: Java,
      description: `Java is a class-based, 
      object-oriented programming language that is designed to have as few implementation dependencies as possible. 
      It is a general-purpose programming language intended to let application developers write once, run anywhere (WORA), 
      meaning that compiled Java code can run on all platforms that support Java without the need for recompilation. 
      Java applications are typically compiled to bytecode that can run on any Java virtual machine (JVM) regardless of the underlying computer architecture. The syntax of Java is similar to C and C++, but it has fewer low-level facilities than either of them. As of 2019, Java was one of the most popular programming languages in use according to GitHub, particularly for client-server web applications, with a reported 9 million developers.`,
    },
    {
      title: "Go",
      id: 6,
      completed: false,
      disabled: false,
      imgSrc: Go,
      description: `Go is a statically typed, compiled programming language designed at Google. 
      Go is syntactically similar to C, but with memory safety, garbage collection, structural typing, and 
      CSP-style concurrency.`,
    },
    {
      title: "C#",
      id: 7,
      completed: false,
      disabled: false,
      imgSrc: CSharp,
      description: `C# is a general-purpose, multi-paradigm programming language encompassing strong typing, lexically scoped, imperative, declarative, functional, generic, object-oriented (class-based), and component-oriented programming disciplines. It was developed around 2000 by Microsoft as part of its .NET initiative and later approved as an international standard by Ecma (ECMA-334) and ISO (ISO/IEC 23270). C# is one of the programming languages designed for the Common Language Infrastructure.  C# is intended to be a simple, modern, general-purpose, object-oriented programming language. Its development team is led by Anders Hejlsberg.`,
    },
  ];
