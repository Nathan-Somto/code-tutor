import Python from "@/assets/courses/python.png";
import CPlusPlus from "@/assets/courses/c++.png";
import C from "@/assets/courses/c.png";
import Go from "@/assets/courses/go.png";
import JS from "@/assets/courses/js.png";
import CSharp from "@/assets/courses/csharp.png";
import Java from "@/assets/courses/java.png";
import React from "react";
import Card from "@/components/course/Card";
import { SheetContent, Sheet, SheetHeader } from "@/components/ui/sheet";
import {Spinner} from "@/components/ui/spinner";
import ReactMarkdown from "@/components/ReactMarkdown";
const sampleData = [
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
export default function Courses() {
  const [courseData, setCourseData] = React.useState<typeof sampleData | null>(
    null
  );
  const [courseInfo, setCourseInfo] = React.useState({
    title: "",
    id: "",
    description: "",
  });
  const [openSheet, setOpenSheet] = React.useState(false);
  React.useEffect(() => {
    if (courseData === null) {
      const enrolledCourses = sampleData
        .filter((course) => course?.progress)
        .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
      const unEnrolledCourses = sampleData.filter(
        (course) => course.progress === undefined
      );
      setCourseData([...enrolledCourses, ...unEnrolledCourses]);
    }
  }, [courseData]);
  if (courseData === null) {
    return (
      <div className="relative h-screen">
        <Spinner
        variant="dots"
        withContainer
        containerBackground="transparent"
        containerType="center"
        size= "md"
     />
      </div>
    );
  }
  function handleInfoClick(id: string) {
    const course = sampleData.find((course) => course.id.toString() === id);
    if (!course) return;
    setOpenSheet(true);
    setCourseInfo({
      description: course.description,
      title: course.title,
      id: id,
    });
  }
  /*  */
  return (
    <div className="px-2">
      <h1 className="text-4xl leading-nomral mt-8 lg:mt-5 mb-16 tracking-wide text-center">
        Select a{" "}
        <span className="relative text-primary tracking-tighter font-medium">
          Course
          <svg
            className="absolute -bottom-5 left-0 right-0 mx-auto w-full h-10"
            viewBox="0 0 436 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 11.6683C27.5507 31.3629 46.9422 39.6998 78.4385 38.3C106.882 37.0359 137.821 23.5277 164.275 13.6843C197.028 1.49724 261.319 -8.02763 280.351 30.7667C295.128 60.8895 272.979 96.9103 238.122 87.1069C224.684 83.3275 217.74 65.3879 223.692 52.9421C230.121 39.4995 249.34 33.0192 262.632 29.9179C298.328 21.5889 322.109 55.0269 354.41 60.8997C384.588 66.3865 406.997 52.8685 429.849 34.5864C431.806 33.0205 430.804 43.4396 430.804 46.0455C430.804 55.5985 432.714 51.3586 432.714 44.1356C432.714 39.4902 435.161 29.6135 428.894 32.2521C424.373 34.1558 414.869 34.5865 409.795 34.5865"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>
      {/* List of Courses arranged in order of my enrolled courses */}
      <section className="grid md:grid-cols-2 max-w-5xl mx-auto lg:grid-cols-3 xl:grid-cols-4 justify-items-center  gap-6 xl:gap-8">
        {courseData.map((course) => (
          <Card
            handleInfoClick={handleInfoClick}
            id={course.id.toString()}
            imageSrc={course.imgSrc}
            title={course.title}
            disabled={course.disabled}
            active={course?.progress !== undefined}
            completed={course?.completed}
            key={course.id}
            progress={course?.progress}
          />
        ))}
      </section>
      {/* More info sheet */}
      <Sheet
        open={openSheet}
        onOpenChange={(prevState) => setOpenSheet(prevState)}
      >
        <SheetContent side="right" className="py-3">
          <SheetHeader className="text-3xl font-semibold tracking-tight mb-5">
            {courseInfo.title}
          </SheetHeader>
          <ReactMarkdown markdown={courseInfo.description} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
