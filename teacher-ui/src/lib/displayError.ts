import { AxiosError } from "axios";
import type { Toast, ToasterToast } from "@/components/ui/toast/use-toast";
export function displayError( toast: (props: Toast) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
}, error: unknown, defaultMessage: string = "An error occurred"): void {
let description = defaultMessage;
if (error instanceof Error) {
    description = error.message;
}
else if(typeof error === "string"){
    description = error;
}
else if (error instanceof AxiosError && error.response?.data.message) {
    description = error.response.data.message;
}
    toast({
        title: "Error",
        description,
        variant: "destructive"
    });

}