import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center text-[17px] font-normal whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Apple Primary Pill - Action Blue (#0066cc)
        default:
          "rounded-full bg-primary text-primary-foreground hover:bg-[#0071e3] tracking-[-0.374px]",
        // Apple Secondary Pill - Ghost with blue border
        outline:
          "rounded-full border border-primary bg-transparent text-primary hover:bg-primary/5 tracking-[-0.374px]",
        // Apple Pearl Capsule - Soft background
        secondary:
          "rounded-[11px] border-[3px] border-[var(--divider-soft)] bg-[var(--surface-pearl)] text-[var(--ink-muted-80)] hover:bg-[var(--canvas-parchment)] text-[14px] tracking-[-0.224px]",
        // Apple Ghost - Minimal
        ghost:
          "rounded-lg text-primary hover:bg-[var(--canvas-parchment)] tracking-[-0.374px]",
        // Apple Dark Utility - Global nav style
        dark:
          "rounded-lg bg-[var(--ink)] text-[var(--body-on-dark)] hover:bg-[var(--surface-tile-1)] text-[14px] tracking-[-0.224px]",
        destructive:
          "rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline tracking-[-0.374px]",
      },
      size: {
        // Apple default button padding
        default: "h-11 gap-2 px-[22px] py-[11px]",
        xs: "h-7 gap-1 px-3 py-1 text-[12px]",
        sm: "h-8 gap-1.5 px-4 py-2 text-[14px]",
        lg: "h-12 gap-2 px-7 py-[14px] text-[18px] font-light",
        icon: "size-11",
        "icon-xs": "size-7 rounded-lg",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12",
        // Apple circular icon button
        "icon-circular": "size-11 rounded-full bg-[rgba(210,210,215,0.64)] text-[var(--ink)] hover:bg-[rgba(210,210,215,0.8)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
