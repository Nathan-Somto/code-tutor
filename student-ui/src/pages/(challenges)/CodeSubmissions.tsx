import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import ReactMarkdown from "@/components/ReactMarkdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams} from "react-router-dom";

type Data = {
  description: string;
  submissions: {
    code: string;
    avatar: string;
    username: string;
    id: string;
  }[];
};

const dummyData: Data = {
  description: "## Announce to The World!\n\nTo Begin your Programming Journey announce it to the world by printing\n ```py\n\"Hello world\"\n```",
  submissions: [
    {
      code: "```python\ndef hello_world():\n    return 'Hello, World!'\n```",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      username: "user1",
      id: "1",
    },
    {
      code: "```python\ngreet = lambda: 'Hello, World!'\n```",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      username: "user2",
      id: "2",
    },
    {
      code: "```python\nprint('Hello, World!')\n```",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      username: "user3",
      id: "3",
    },
  ],
};

export default function CodeSubmissions() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Data | null>(null);
  const { courseId, levelId } = useParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData(dummyData);
    }, 1000); // Simulate a delay
  }, []);
  function handler() {
    navigate(`/learn/${courseId}`);
  }
  return (
    <div className="px-6 py-8 mb-16">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-5 ">Code Submissions</h1>
      {/* Description of Challenge (use react markdown component) with a chevron to reveal it */}
      <div className="mb-5">
        <Button onClick={() => setOpen((prev) => !prev)} className="flex items-center ">
          Description {open ? <ChevronUpIcon className="ml-2" /> : <ChevronDownIcon className="ml-2" />}
        </Button>
        {open && (
          <div className="mt-4 p-4 border rounded-md">
            <ReactMarkdown markdown={data?.description ?? ''} />
          </div>
        )}
      </div>
        <Separator/>
      </header>

      {/* A list of code submissions: their code (render in markdown), their avatar, username */}
      <div className="space-y-4">
        {data ? (
          data.submissions.map((submission) => (
            <div key={submission.id} className="p-4 border rounded-md flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={submission.avatar} alt={submission.username} />
                <AvatarFallback>{submission.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold mb-2">{submission.username}</h2>
                <ReactMarkdown markdown={submission.code} />
              </div>
                <footer
                className={
                  "border-t h-16 bottom-0 bg-background fixed  inset-x-0 w-full mx-auto flex items-center justify-between px-6 "
                }
              >
                <Button
                  size="sm"
                  className="text-slate-700 lg:h-11 lg:px-8"
                  onClick={() =>
                    navigate(
                      `/challenge/${courseId}/level/${levelId}/code`
                    )
                  }
                >
                  Practice Again
                </Button>
                <Button
                  variant={"primary"}
                  onClick={handler}
                  size="sm"
                  className="text-slate-700 lg:h-11 lg:px-8"
                >
                  Continue
                </Button>
              </footer>
            </div>
          ))
        ) : (
            <Spinner
        color="green"
        size="xs"
        variant="dots"
        withContainer
        containerBackground="transparent"
        containerType="full"
      />
        )}
      </div>
    </div>
  );
}
