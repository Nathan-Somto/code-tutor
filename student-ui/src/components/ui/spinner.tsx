import { cn } from "@/utils";
import React from "react";

interface SizeProps {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface ColorProps {
  slate: string;
  blue: string;
  red: string;
  green: string;
  foreground: string;
  primary: string;
  secondary: string;
}

const sizesClasses: SizeProps = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
};

const colorClasses: ColorProps = {
  slate: "text-slate-800 bg-slate-800",
  blue: "text-blue-500 bg-blue-500",
  red: "text-red-500 bg-red-500",
  green: "text-emerald-500 bg-emerald-500",
  foreground: "dark:text-white dark:bg-white bg-black text-black",
  primary: "text-primary bg-primary",
  secondary: "text-secondary bg-secondary",
};

interface VariantProps {
  size?: keyof typeof sizesClasses;
  color?: keyof typeof colorClasses;
}
interface ContainerProps {
  containerType?: "center" | "full";
  containerBackground?: "blur" | "transparent" | "background";
  children: React.ReactNode;
}
interface SpinnerProps extends VariantProps, ContainerProps {
  variant?: "round" | "dots";
  withContainer?: boolean;
}
const RoundSpinner = ({
  size = "md",
  color = "slate",
}: VariantProps) => {
  return (
    <div aria-label="Loading..." role="status">
      <div
        className={cn("animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]", sizesClasses[size], colorClasses[color], 'bg-transparent')}
        
      >
       </div>
    </div>
  );
};
const DotsSpinner = ({ color = "primary", size = "md" }: VariantProps) => {
  return (
    <div className="flex space-x-2 justify-center items-center">
      <span className="sr-only">Loading...</span>
      <div
        className={cn(
          "rounded-full animate-bounce [animation-delay:-0.3s]",
          sizesClasses[size],
          colorClasses[color]
        )}
      ></div>
      <div
        className={cn(
          " rounded-full animate-bounce [animation-delay:-0.15s]",
          sizesClasses[size],
          colorClasses[color]
        )}
      ></div>
      <div
        className={cn(
          "rounded-full animate-bounce",
          sizesClasses[size],
          colorClasses[color]
        )}
      ></div>
    </div>
  );
};
const Container = ({
  children,
  containerBackground: background = "blur",
  containerType: type = "full",
}: ContainerProps) => {
  return (
    <div
      className={cn(
        "w-full flex justify-center items-center z-[90000000000000]",
        background === "transparent" && "bg-transparent",
        background === "background" && "bg-neutral-400 dark:bg-neutral-600",
        background === 'blur' && 'backdrop-blur-md',
        type === 'full' && 'fixed h-screen inset-0',
        type === 'center' && 'absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'
      )}
    >
      {children}
    </div>
  );
};

export const Spinner = ({
  variant = "round",
  withContainer = false,
  containerBackground = "blur",
  containerType = 'full',
  ...Props
}: Omit<SpinnerProps, 'children'>) => {
  const Comp = ({ ...Props }: VariantProps) =>
    variant === "round" ? (
      <RoundSpinner {...Props} />
    ) : (
      <DotsSpinner {...Props} />
    );
  if (withContainer) {
    return (
      <Container
        containerBackground={containerBackground}
        containerType={containerType}
      >
        <Comp {...Props} />
      </Container>
    );
  }
  return <Comp {...Props} />;
};
