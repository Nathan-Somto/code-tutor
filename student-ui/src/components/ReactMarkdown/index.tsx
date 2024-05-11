import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import Markdown from "react-markdown"
import {vscDarkPlus} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { cn } from "@/utils";

type Props = {
    markdown: string,
    pClassName?:string,
    codeClassName?:string
}
function ReactMarkdown({ markdown, pClassName, codeClassName}: Props) {
  //const theme = true ? dark : oneLight;
  return (
    <Markdown
     children={markdown}
     components={{
        code({node, className, children, ref, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return  match ? (
            <SyntaxHighlighter
            {...props}
            children = {String(children).replace(/\n$/, '')}
            PreTag="pre"
            language={match[1]}
           style = {vscDarkPlus}
           className={cn(className, codeClassName)}

            />
            ) : (
            <code className={cn(className, codeClassName)} {...props}>
                {children}
            </code>
            )  
     },
     ul({node, children, ...props}){
      return <ul className="list-disc my-3 space-y-0.5 pl-5" {...props}>{children}</ul>
     },
     h1({node, children, ...props}) {
        return <h1 className="text-3xl font-bold mb-0.5 leading-relaxed" {...props}>{children}</h1>
     },
     h2({node, children, ...props}){
        return <h2 className="text-2xl font-semibold mb-0.5" {...props}>{children}</h2>
     },
     p({node, children, ...props}){
        return <p className={cn('leading-relaxed whitespace-break-spaces tracking-wide my-1.5', pClassName)} {...props}>{children}</p>
     }
    } }
    />
  )
}

export default ReactMarkdown