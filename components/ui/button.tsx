import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          "font-mono",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2": variant === 'default',
            "hover:bg-accent hover:text-accent-foreground px-4 py-2": variant === 'ghost',
            "border border-border bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2": variant === 'outline',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
