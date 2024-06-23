import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden">
      <div className="absolute h-36 w-36 p-36 blur-lg rounded-full bg-gradient-to-tl left-0 right-0 mx-auto from-violet-950 z-[600] via-indigo-950 opacity-30 -top-36 to-purple-950"></div>
      <div className="absolute h-36 w-36 p-28 blur-lg rounded-full bg-gradient-to-r -left-8 from-violet-950 opacity-30 -bottom-12 to-indigo-950"></div>
      <div className="h-screen relative overflow-x-hidden">
        <nav className="w-full max-w-7xl inset-x-0 px-4 bg-background z-[500] mx-auto py-4 fixed top-0 border-b">
          <div className="w-full flex items-center justify-between">
            <Link
              className="flex items-center text-green-400  opacity-75 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
              to="/"
            >
              Code
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
                tutor
              </span>
            </Link>

            <div className="flex w-1/2 justify-end content-center gap-3">
              <Button
                variant={"link"}
                onClick={() => navigate("/login")}
                className="opacity-75 dark:text-white"
              >
                Login
              </Button>
              <Button size="rounded" className="h-9 w-9 p-2">
                <Github />
              </Button>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl pt-24 md:pt-36 px-4 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-9/12 xl:w-6/12 justify-center lg:items-start">
            <h1 className="my-4 text-4xl md:text-5xl  text-white opacity-75 font-bold leading-tight text-center md:text-left">
              Learn{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-indigo-500 to-purple-500">
                A Programming{" "}
              </span>
              Language!
            </h1>
            <p className="leading-normal text-[14.8px] md:text-xl mb-3 md:text-left text-center">
              master programming in a fun addictive way.
            </p>
            <div className="flex gap-5 xl:w-[75%] flex-col md:flex-row mt-3 w-full justify-center md:justify-start">
              <Button
                variant="primary"
                onClick={() => navigate("/register")}
                className=" px-2 md:px-6 w-full"
              >
                Get Started
              </Button>
              <Button
                variant="primary-outline"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                I Already Have an Account
              </Button>
            </div>
          </div>

          <div className="w-full mt-5 lg:mt-0 md:w-9/12 xl:w-6/12 border-purple-950 relative h-[300px]  xl:h-[400px] rounded-lg bg-gradient-to-tr border from-blue-950 via-indigo-950 to-purple-950">
            <div className="flex flex-row">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-700 to-violet-600 w-full"></div>
              <div className="h-[1px] bg-gradient-to-r from-violet-600 to-transparent w-full"></div>
            </div>
            <div className="px-8 py-5">
              <div className="flex flex-row space-x-2">
                <div className="rounded-full bg-red-400 w-3 h-3"></div>
                <div className="rounded-full bg-orange-400 w-3 h-3"></div>
                <div className="rounded-full bg-green-200 w-3 h-3"></div>
              </div>
            </div>
            <div className="px-8 py-8 border-t-[2px] border-indigo-900 overflow-hidden">
              <code
                style={{
                  textShadow: "none",
                  direction: "ltr",
                  textAlign: "left",
                  whiteSpace: "pre",
                  wordSpacing: "normal",
                  wordBreak: "normal",
                  lineHeight: 1.5,
                  tabSize: 4,
                  hyphens: "none",
                }}
              >
                <div>
                  <span>alive </span>
                  <span className="text-accent">=</span>
                  <span> </span>
                  <span className="text-green-500">True</span>
                  <span></span>
                  <span> </span>
                </div>
                <div>
                  <span className="text-accent">while</span>
                  <span> alive</span>
                  <span>:</span>
                  <span></span>
                </div>
                <div className="ml-4">
                  <span> eat</span>
                  <span className="text-green-500 opacity-75">{"("}</span>
                  <span className="text-green-500 opacity-75">{")"}</span>
                  <span></span>
                </div>
                <div className="ml-4">
                  <span> sleep</span>
                  <span className="text-green-500 opacity-75">(</span>
                  <span className="text-green-500 opacity-75">)</span>
                  <span></span>
                </div>
                <div className="ml-4 border-r-white pr-1 inline-block blink border-r-4">
                  <span> code</span>
                  <span className="text-green-500 opacity-75">(</span>
                  <span className="text-green-500 opacity-75">)</span>
                  <span> </span>
                </div>
              </code>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
