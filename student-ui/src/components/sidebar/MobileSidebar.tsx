import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import Sidebar from '.'
import {useLocation} from "react-router-dom"
import {Button} from "@/components/ui/button"
export default function MobileSidebar() {
    const {pathname} = useLocation()
    return(
        <nav className="lg:hidden text-primary-foreground capitalize px-6 h-[52px] gap-4 flex items-center bg-primary/90 border-b fixed top-0 w-full z-50">
      <Sheet>
        <SheetTrigger clasName='' asChild>
            <Button size="rounded" className="h-8 w-8 text-sm">
            <Menu/>
            </Button>
        </SheetTrigger>
        <SheetContent side="left">
            <Sidebar/>
        </SheetContent>
      </Sheet>
      <p className="font-medium text-[20px] tracking-tighter">{pathname.split('/')[1]}</p>
    </nav>
    )
}