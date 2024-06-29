import React from "react";
import Card from "@/components/course/Card";
import { SheetContent, Sheet, SheetHeader } from "@/components/ui/sheet";
import ReactMarkdown from "@/components/ReactMarkdown";
// uncomment this for hardcoded ui check!
//import sampleData from "@/data/sample-curriculum/courses.json";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useAuth } from "@/providers/AuthProvider";
import { ResponseData } from "@/types";


type CourseData = {
  id: string;
  title: string;
  description: string;
  imageSrc: string | null;
  language: string;
  isEnrolled: boolean;
  progress: number | undefined;
}[];



export default function Courses() {
  const { state } = useAuth();
  const { data: response, error, isPending, isError } = useGetQuery<ResponseData<{courses: CourseData}>>({
    enabled: true,
    route: `/students/${state.auth?.profileId}/courses`,
    queryKey: ["courses", state.auth?.profileId],
    displayToast: false,
  });
  const [courseData, setCourseData] = React.useState<CourseData | null>(null);
  const [disable, setDisable] = React.useState(false);
  const [courseInfo, setCourseInfo] = React.useState({
    title: "",
    id: "",
    description: "",
  });
  const [openSheet, setOpenSheet] = React.useState(false);

  React.useEffect(() => {
    console.log("the data: ",response);
    if (response?.data && response.data.body.courses) {
      const enrolledCourses = response.data.body.courses
        .filter((course) => course?.progress !== undefined)
        .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
      const unEnrolledCourses = response.data.body.courses.filter(
        (course) => course.progress === undefined
      );
      setCourseData([...enrolledCourses, ...unEnrolledCourses]);
    }
  }, [response?.data, response?.data?.body?.courses]);

  const handleInfoClick = (id: string) => {
    const course = courseData?.find((course) => course.id.toString() === id);
    if (!course) return;
    setOpenSheet(true);
    setCourseInfo({
      description: course.description,
      title: course.title,
      id: id,
    });
  };
  return (
    <>
      {isPending && (
        <div>
          <div className="h-24 py-3 rounded-md bg-gray-300 dark:bg-gray-800 mb-6 w-[90%] mx-auto"></div>
        <div className="grid md:grid-cols-2 animate-pulse px-8 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 max-w-5xl mx-auto mt-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="w-64 h-40 animate-pulse bg-gray-300 dark:bg-gray-800 rounded-lg relative">
              <div className="absolute w-full h-full flex  justify-center">
                <div className="w-48 h-16 bg-gray-400 mt-5 dark:bg-gray-900 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
      {isError && (
        <div className="text-center mt-20">
          <h2 className="text-2xl font-semibold text-red-500">Error</h2>
          <p className="mt-4 text-lg">{error?.message}</p>
        </div>
      )}
      {!isPending && !isError && courseData && (
        <div className="px-2">
          <h1 className="text-4xl leading-normal mt-8 lg:mt-5 mb-16 tracking-wide text-center">
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
          <section className="grid md:grid-cols-2 max-w-5xl mx-auto lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-6 xl:gap-8">
            {courseData.map((course) => (
              <Card
                handleInfoClick={handleInfoClick}
                id={course.id.toString()}
                imageSrc={course.imageSrc ?? ''}
                title={course.title}
                disabled={disable}
                setDisable={setDisable}
                active={course.isEnrolled}
                completed={course?.progress === 100}
                key={course.id}
                progress={course?.progress}
              />
            ))}
          </section>
          <Sheet
            open={openSheet}
            onOpenChange={(prevState) => setOpenSheet(prevState)}
          >
            <SheetContent side="right" className="py-3 h-screen overflow-auto">
              <SheetHeader className="text-xl opacity-80 font-medium tracking-tight mb-5">
                {courseInfo.title}
              </SheetHeader>
              <ReactMarkdown markdown={courseInfo.description} />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
}

