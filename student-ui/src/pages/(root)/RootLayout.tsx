import Sidebar from "@/components/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

import RootProvider from "../../providers/RootProvider";
import Widget from "@/components/widget";
import { cn } from "@/utils";
export default function RootLayout() {
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <RootProvider>
      <div>
        <MobileSidebar />
        <Sidebar className="hidden lg:block" />
        <main
          className={cn(
            "lg:ml-[256px] lg:w-[calc(100%-556px)] mt-16 w-full",
            pathname === "/courses" && "lg:ml-[256px] lg:w-[calc(100%-256px)]"
          )}
        >
          <Outlet />
        </main>
        {pathname !== "/courses" && <Widget />}
      </div>
    </RootProvider>
  );
}
