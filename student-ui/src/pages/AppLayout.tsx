import RootProvider from "@/providers/RootProvider";
import { Outlet } from "react-router-dom";

export default function AppLayout(){
    return (
        <RootProvider>
            <Outlet/>
        </RootProvider>
    )
}