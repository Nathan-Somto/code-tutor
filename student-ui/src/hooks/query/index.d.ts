import { QueryKey } from "@tanstack/react-query";

export type MutateType<T> = {
    route: string;
    onSuccess?: (response: AxiosResponse<any, any>) => void;
    onSettled?: () => void;
    defaultMessage: string;
    method: "post" | 'patch' | 'put'
}
export type GetQueryType<T> = {
    enabled: boolean,
    route: string,
    queryKey: QueryKey,
    displayToast?: boolean,
    defaultMessage?: string,
    
}