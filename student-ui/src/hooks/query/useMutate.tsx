import { mainApi } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { MutateType } from ".";
import { useToast } from "@/components/ui/use-toast";
import { displayError } from "@/utils/displayError";

function useMutate<T>({onSuccess, defaultMessage, route, method='post', onSettled}:MutateType<T>) {
const {toast} = useToast()
const {isPending, isSuccess, mutate, mutateAsync} = useMutation({
    mutationFn: (data: T) =>  mainApi[method](route, data),
    onSuccess: (response) => {
        if(onSuccess){
            onSuccess(response);
        }
    },
    onError: (err) => {
        displayError(toast,err, defaultMessage)
    }
    ,
    onSettled: () => {
        if(onSettled){
            onSettled();
        }
    }
});
return {isPending, isSuccess, mutate, mutateAsync};
}
export {useMutate}