import Sidebar from "@/components/sidebar";
import { Outlet } from "react-router-dom";
import MobileSidebar from "@/components/sidebar/MobileSidebar";
export default function RootLayout() {
  return (
    <div>
      <MobileSidebar />
      <Sidebar className="hidden lg:block" />
      <main className="lg:ml-[256px] lg:w-[calc(100%-256px)] mt-16 lg:mt-0">
        <Outlet />
      </main>
    </div>
  );
}
