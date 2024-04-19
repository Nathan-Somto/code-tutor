import LevelButton, { LevelButtonProps } from "./LevelButton";
import TopicHeader, { TopicHeaderProps } from "./TopicHeader";
type Props = {
    topic : TopicHeaderProps,
    levels: (LevelButtonProps & {id : string})[]
}
export default function Topic({
    topic,
    levels
}: Props){
    console.log(levels)
    const currentCourse = {id: "1234567"}
    return (
        <div>
            <TopicHeader
            description={topic.description}
            index={topic.index}
            isUnlocked={topic.isUnlocked}
            name={topic.name}
            xpNeeded={topic.xpNeeded}
            />
             <div className="relative my-3  flex w-full flex-col items-center justify-center">
            {
            levels.map((level, index) => (
                    <LevelButton
                    {...level}
                    link={`/challenge/${currentCourse.id}/level/${level.id}/${level.levelType}`}
                    index={index}
                    key={level.id}
                    />
                ))
            }
            </div>
        </div>
    )
}