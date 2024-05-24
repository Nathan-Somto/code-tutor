import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from ".";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserProgressHeader from "../userprogressHeader";
export default function MobileSidebar() {
  const { pathname } = useLocation();
  return (
    <nav className="lg:hidden text-secondary-foreground bg-background capitalize px-6 h-[52px] justify-between  flex items-center  border-b fixed top-0 w-full z-50">
      <div className="flex gap-2 items-center">
        <Sheet>
          <SheetTrigger className="" asChild>
            <Button size="rounded" className="h-7 w-7 ">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <p className="font-medium text-[14px] tracking-tighter">
          {pathname.split("/")[1]}
        </p>
      </div>
      <div>
        <UserProgressHeader />
      </div>
    </nav>
  );
}
