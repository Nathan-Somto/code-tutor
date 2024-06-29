import ProfileBanner from "@/components/profile/ProfileBanner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sampleData } from "@/components/course/sampleData";
import { Progress } from "@/components/ui/progress";
import Badges from "@/components/badges";
import { useRoot } from "@/providers/RootProvider";
import { Spinner } from "@/components/ui/spinner";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { ProfileType, ResponseData } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { ErrorMessage } from "@/components/error-message";
export default function ProfilePage() {
  const {isFetching} = useRoot();
  const {state: {auth}} = useAuth();
  const {data: response , isError, isPending, refetch} = useGetQuery<ResponseData<{profile: ProfileType}>>({
    route: `/students/${auth?.profileId}/profile`,
    queryKey: ["profile", auth?.profileId],
    enabled: !isFetching
  })
  const user = {
    enrolledCourses: [1],
    badges: [],
  };
  if(isError){
    return <ErrorMessage refetch={refetch}/>
  }
  const userData = response?.data?.body?.profile ||  {
    name: "John Doe",
    username: "john_doe",
    xpPoints: 0,
    streakCount: 0,
    rank: "Easy",
    profile_photo: null,
    joinedAt: new Date(),
    badges: [],
    gems:45
  }
  if(isPending){
    return (
      <Spinner
      color="primary"
      variant="round"
      containerType="full"
      withContainer
      containerBackground="blur"
      />
    )
  }
  return (
    <div>
      {/* Profile Banner */}
      <ProfileBanner user={{...userData}} />
      {/* Name, Programme, Date Joined, Profile Photos.*/}
      <Separator />
      {/* Stats section */}
      {/* Enrolled Courses Section */}
      <div className="w-full grid lg:grid-cols-2 mt-8  px-6 gap-8 lg:gap-10">
        <div className="border-2 border-slate-700  rounded-2xl pt-2 pb-6 px-5 !max-h-fit min-h-[180px] shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="lg:text-xl tracking-tighter font-medium leading-relaxed text-lg ">
              Courses Progress
            </h2>
            <Button variant="link" className="font-medium">
              View All
            </Button>
          </div>
          <div className="space-y-2 mt-3">
            {sampleData
              .filter((data) => user.enrolledCourses.includes(data.id))
              .map((item) => (
                <div
                  className="flex gap-x-4 max-w-full p-2 items-center hover:bg-slate-300 rounded-md dark:hover:bg-slate-900 cursor-pointer"
                  key={item.id}
                >
                  <img
                    src={item.imgSrc}
                    alt="course image"
                    className="lg:h-12 lg:w-12 h-16 w-16 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="mb-2 font-medium tracking-tighter">
                      {item.title}
                    </p>
                    <Progress
                      value={item.progress}
                      className="h-2 w-full flex-shrink-0"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="border-2 border-slate-700  rounded-2xl pt-2 pb-6 px-5 !max-h-fit min-h-[180px] shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="lg:text-xl tracking-tighter font-medium leading-relaxed text-lg ">
              Badges
            </h2>
          </div>
          <div className="gap-3 mt-3 flex flex-wrap">
          {isFetching ? (
            <Spinner
            color="green"
            />
          ) : (
            <Badges badges={userData?.badges ?? []}/>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
