import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
export default function StyleGuide(){
    return (
        <div>
            <h1 className="text-3xl leading-snug mb-4 text-center">Style Guide</h1>
            <section>
                <h2 className="text-2xl bg-primary-foreground py-2 mb-6 text-center">Button's</h2>
                <div className="space-y-5 flex flex-col max-w-[400px] mx-auto">
                <Button>DEFAULT</Button>
                <Button variant="primary">PRIMARY</Button>
                <Button variant={'primary-outline'}>PRIMARY OUTLINE</Button>
                <Button variant={'secondary'}>SECONDARY</Button>
                <Button variant={'secondary-outline'}>SECONDARY OUTLINE</Button>
                <Button size="rounded">R</Button>
                <Button variant="danger">DANGER</Button>
                <Button variant="super">SUPER</Button>
                <Button variant="link">LINK</Button>
                <Button variant="ghost">GHOST</Button>
                </div>
            </section>
            <section>
            <h2 className="text-2xl bg-primary-foreground py-2 mb-6 text-center">Spinner's</h2>
            <div className="space-y-5 flex flex-col max-w-[400px] mx-auto">
                <Spinner/>
                <Spinner color="green" size="lg"/>
            </div>
            </section>
        </div>
    )
}