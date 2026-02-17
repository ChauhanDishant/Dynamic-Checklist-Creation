import React from 'react'
import { cn } from '@/utils'

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label'
  className?: string
  children: React.ReactNode
  as?: React.ElementType
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  className,
  children,
  as,
}) => {
  const styles = {
    h1: 'text-4xl font-bold tracking-tight',
    h2: 'text-3xl font-semibold tracking-tight',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    body: 'text-base',
    caption: 'text-sm text-muted-foreground',
    label: 'text-sm font-medium',
  }

  const defaultElements = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    body: 'p',
    caption: 'span',
    label: 'label',
  }

  const Component = as || defaultElements[variant]

  return <Component className={cn(styles[variant], className)}>{children}</Component>
}

export default Typography
