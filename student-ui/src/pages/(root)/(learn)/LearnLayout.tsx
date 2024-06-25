import LearnProvider from "@/providers/LearnProvider";
import { Outlet } from "react-router-dom";

export function LearnLayout() {
  return (
    <LearnProvider>
      <Outlet />
    </LearnProvider>
  );
}
