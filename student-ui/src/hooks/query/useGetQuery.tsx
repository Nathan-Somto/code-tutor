import { mainApi } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { GetQueryType } from ".";
import React from "react";
import { displayError } from "@/utils/displayError";
import { useToast } from "@/components/ui/use-toast";

export function useGetQuery<T>({
  enabled,
  route,
  queryKey,
  defaultMessage = "failed to fetch",
  displayToast=false
}: GetQueryType<T>) {
  const { data, isPending, refetch, error, isError } = useQuery<T>({
    enabled,
    queryKey,
    queryFn: () => mainApi.get(route),
  });
  const { toast } = useToast();
  React.useEffect(() => {
    if (displayToast && isError && error) {
      displayError(toast, error, defaultMessage);
    }
  }, [displayToast, isError, error, toast]);
  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
}
