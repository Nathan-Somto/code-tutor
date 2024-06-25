import { Link } from "react-router-dom";
import UserProgressHeader from "../userprogressHeader";
import { BadgesData } from "../badges/data";
import Badges from "../badges";
export default function Widget() {
  return (
    <div className="fixed w-[300px] hidden lg:block h-screen py-4 px-5 top-0 right-0">
      <UserProgressHeader/>
      {/* Top five Quests yet to be completed */}
      <div className=" min-h-[300px] border-2 dark:border-slate-700 border-slate-500 items-center px-2 py-3 mt-6   rounded-md">
        <h3 className="text-lg font-semibold text-center mb-3">Your Badges</h3> 
        <div className="flex flex-wrap gap-4">
        <Badges badges={BadgesData}/>
        </div>
      </div>
      <footer className="text-slate-600 bottom-6 absolute text-center left-0 right-0">
        created by <Link to={'https://github.com/nathan-somto'} className="dark:text-green-400 text-green-500 hover:underline">Nathan Somto</Link>
      </footer>
    </div>
  );
}
