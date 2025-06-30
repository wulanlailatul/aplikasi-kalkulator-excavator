import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-2xl border bg-white text-black shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-4", className)} {...props} />
)
CardHeader.displayName = "CardHeader"

const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
)
CardTitle.displayName = "CardTitle"

const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-4 pt-0", className)} {...props} />
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
