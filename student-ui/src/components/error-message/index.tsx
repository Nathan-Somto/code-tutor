import { Button } from "../ui/button";

export function ErrorMessage({ refetch }: {refetch: () => void}) {
  return (
    <div className="bg-red-100 border border-red-400 mx-5 text-red-700 px-4 py-3 rounded relative" role="alert">
        <h1 className="text-xl font-medium mb-2">Something went wrong</h1>
        <p className="dark:text-red-800 text-red-500 mb-3">An Unexpected error occured</p>
        <Button onClick={() => refetch() } variant={'secondary'}>Try Again</Button>
    </div>
  );
}