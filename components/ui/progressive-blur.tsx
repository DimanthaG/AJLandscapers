'use client';
import { cn } from '@/lib/utils';

export const GRADIENT_ANGLES = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const;

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  className?: string;
};

export function ProgressiveBlur({
  direction = 'bottom',
  className,
}: ProgressiveBlurProps) {
  return (
    <div className={cn('relative w-full h-full', className)}>
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to ${GRADIENT_ANGLES[direction]}, 
            rgba(17, 17, 17, 0) 0%,
            rgba(17, 17, 17, 0.2) 20%,
            rgba(17, 17, 17, 0.4) 40%,
            rgba(17, 17, 17, 0.6) 60%,
            rgba(17, 17, 17, 0.8) 80%,
            rgba(17, 17, 17, 1) 100%
          )`
        }}
      />
    </div>
  );
}
