import { BellIcon, HomeIcon, PenIcon, PlusIcon, UserIcon } from "lucide-vue-next";

export const data = (profileId: string) => ( [
    {
        text: "Home",
        icon: HomeIcon,
        link: '/home'
    },
    {
    text: "Create Course",
    icon: PlusIcon,
    link: '/course/new'
}, {
    text: "Profile",
    icon: UserIcon,
    link: `/profile/${profileId}`
},
{
    text: "Notifications",
    icon: BellIcon,
    link:"#"
},
{
    text: "Contribute",
    icon: PenIcon,
    link: "/course/contribute"
}
] );