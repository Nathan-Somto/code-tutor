export default function StartPopup() {
  return (
    <div className="absolute -top-8 mx-auto left-0 z-[50] right-0 animate-bounce w-24">
      <div className="dark:bg-slate-900 bg-slate-100 tracking-tight border-neutral-500  border-[2px] uppercase rounded-xl text-primary font-semibold text-center px-4 py-3">
        Start
      </div>
      <div className="h-5 w-2.5 overflow-hidden mx-auto left-2/4 absolute -bottom-[14px] -rotate-[270deg] -translate-x-2/4 ">
        <div className="border-[3px] h-[15px] w-[15px] absolute rotate-45   origin-top-left dark:bg-slate-900 border-neutral-500"></div>
      </div>
    </div>
  );
}
