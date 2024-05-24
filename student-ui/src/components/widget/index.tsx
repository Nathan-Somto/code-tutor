import { Link } from "react-router-dom";
import UserProgressHeader from "../userprogressHeader";

export default function Widget() {
  
  return (
    <div className="fixed w-[300px] hidden lg:block h-screen py-4 px-5 top-0 right-0">
      <UserProgressHeader/>
      {/* Top five Quests yet to be completed */}
      <div className="h-[300px] border-2 border-slate-700 mt-6 grid place-items-center rounded-md">
        <p className="text-lg font-semibold text-center">User's Quests to achieve badges comes here!</p>
      </div>
      <footer className="text-slate-600 bottom-6 absolute text-center left-0 right-0">
        created by <Link to={'https://github.com/nathan-somto'} className="text-green-400 hover:underline">Nathan Somto</Link>
      </footer>
    </div>
  );
}