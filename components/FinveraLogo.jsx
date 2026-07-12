"use client"
import Image from 'next/image'
import { useTheme } from '@/components/desktop/ThemeProvider'

/**
 * FinveraLogo — Theme-aware logo component
 *
 * Props:
 *  variant  → "full" (default) | "icon"
 *  size     → "xs" | "sm" | "md" | "lg" | "xl"
 *  className → extra Tailwind classes
 *
 * Light mode → logo-black.png
 * Dark mode  → logo-white.png
 * Icon       → icon.png (always, independent of theme)
 */

const SIZE_MAP = {
  xs: { w: 24, h: 24, cls: 'h-6 w-auto' },
  sm: { w: 80, h: 32, cls: 'h-8 w-auto' },
  md: { w: 120, h: 40, cls: 'h-9 w-auto' },
  lg: { w: 160, h: 52, cls: 'h-12 w-auto' },
  xl: { w: 240, h: 80, cls: 'h-20 w-auto' },
}

const ICON_SIZE_MAP = {
  xs: { w: 24, h: 24, cls: 'h-6 w-6' },
  sm: { w: 28, h: 28, cls: 'h-7 w-7' },
  md: { w: 32, h: 32, cls: 'h-8 w-8' },
  lg: { w: 40, h: 40, cls: 'h-10 w-10' },
  xl: { w: 56, h: 56, cls: 'h-14 w-14' },
}

export default function FinveraLogo({ variant = 'full', size = 'md', className = '', priority = false }) {
  const { resolvedTheme } = useTheme()

  if (variant === 'icon') {
    const dim = ICON_SIZE_MAP[size] || ICON_SIZE_MAP.md
    return (
      <Image
        src="/image/icon.png"
        alt="Finvera Icon"
        width={dim.w}
        height={dim.h}
        className={`${dim.cls} object-contain flex-shrink-0 ${className}`}
        priority={priority}
      />
    )
  }

  // Full logo — switches based on resolved theme
  const dim = SIZE_MAP[size] || SIZE_MAP.md
  const src = resolvedTheme === 'dark' ? '/image/logo-white.png' : '/image/logo-black.png'

  return (
    <Image
      src={src}
      alt="Finvera Logo"
      width={dim.w}
      height={dim.h}
      className={`${dim.cls} object-contain flex-shrink-0 ${className}`}
      priority={priority}
    />
  )
}
