import { ChallengesProvider } from "@/providers/ChallengesProvider";
import { Outlet } from "react-router-dom";

export default function ChallengesLayout() {
    return (
    <ChallengesProvider>
        <Outlet/>
    </ChallengesProvider>
    )
}