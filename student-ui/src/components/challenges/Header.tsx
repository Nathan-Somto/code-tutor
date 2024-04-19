import { X } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
    progress: number;
    hintsLeft: number;
    hintsRefreshDate: Date;
    openModal?: () => void;
}
export default function Header(){
    return (
        <header>
            <Button>
                <X/>
            </Button>
        </header>
    )
}