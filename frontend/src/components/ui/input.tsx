import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-slate-700 bg-transparent px-2.5 py-1 text-base transition-all outline-none placeholder:text-slate-500 focus:outline-none focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/40 focus:shadow-[0_0_15px_rgba(163,230,53,0.3)] focus-visible:outline-none focus-visible:border-[#A3E635] focus-visible:ring-2 focus-visible:ring-[#A3E635]/40 focus-visible:shadow-[0_0_15px_rgba(163,230,53,0.3)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
