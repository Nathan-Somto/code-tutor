import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils"

const buttonVariants = cva(
  "inline-flex items-center rounded-xl ring-2  justify-center border-b-4 hover:border-slate-700 border-slate-600  hover:border-b-2 whitespace-nowrap ring-slate-600 rounded-md text-sm font-medium ring-offset-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-background text-secondary-foreground  ",
        primary: "bg-primary hover:bg-primary/80 border-b-4  hover:border-b-0 text-primary-foreground border-green-600 hover:border-primary/70 ring-offset-green-800 ring-green-600",
        "primary-outline": "bg-background text-primary  hover:text-primary/80",
        danger:
          "dark:bg-rose-600 bg-rose-400 text-destructive-foreground border-b-4  hover:border-b-0 hover:bg-rose-600/90 border-rose-800 hover:border-rose-800/70 ring-rose-800 ring-offset-rose-800 ",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary dark:bg-secondary/80 text-secondary-foreground hover:bg-secondary/70 dark:border-blue-700 ring-blue-700 hover:border-0",
        "secondary-outline": " bg-background text-secondary/80 hover:text-secondary ",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        super: "bg-accent text-accent-foreground border-[rgb(240,208,0)] ring-[rgb(240,208,0)] ring-offset-[rgb(240,208,0)]  hover:border-[rgba(240,208,0,0.7)] border-b-4 hover:border-b-2 hover:ring-[rgba(240,208,0,0.7)]",
        link: "text-primary underline-offset-4 hover:underline border-none ring-none ring-offset-transparent ring-transparent ",
        transparent: "border-none ring-0 ring-offset-transparent hover:bg-slate-800 focus-visible:ring-none focus-visible:ring-transparent focus-visible:ring-offset-none "
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        rounded: "rounded-full h-10 w-10"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
