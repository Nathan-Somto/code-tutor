import { cn } from "@/utils";
import React from "react";
export default function NetworkToast(){
    const [showToast, setShowToast] = React.useState<boolean>(false);
    const [isOnline, setIsOnline] = React.useState<boolean>(true);
    React.useEffect(() => {
        window.addEventListener('online',() => {
            setShowToast(true);
            setIsOnline(true);
        });
        window.addEventListener('offline', () => {
            setShowToast(true);
            setIsOnline(false);
        })
    },[]);
    React.useEffect(() => {
        if(showToast){
            const timeout = setTimeout(() => {
                setShowToast(false);
            }, 3500);
            return () => clearTimeout(timeout);
        }
    }, [showToast])
    if(!showToast){
        return null;
    }
    return (
        <div className={cn("bottom-0 w-full h-8 px-4 py-2  fixed animate-in fade-in-50", !isOnline && "bg-rose-500", isOnline && "bg-green-500")}>
            <p>{isOnline ? "You are now online!" : "you are currently offline"}</p>
        </div>
    )
}