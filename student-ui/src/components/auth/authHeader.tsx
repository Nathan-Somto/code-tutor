import { ChevronLeft } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom";
type Props = {
    actionText?: string;
    actionLink?: string
}
export default function AuthHeader({actionText, actionLink}:Props){
    const navigate = useNavigate();
    return (
        <header className="fixed inset-0 w-full h-20  bg-background flex items-center justify-between px-8">
            <ChevronLeft onClick={() => navigate(-1)} className="h-10 w-10 cursor-pointer"/>
            {(actionText && actionLink) && (
                <Button  onClick={() => navigate(actionLink ?? '#')}>
                {actionText}
                </Button>
            )}
        </header>
    )
}