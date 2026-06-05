import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-purple-600 text-white',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'text-foreground',
        hot: 'border-transparent bg-red-500/20 text-red-400',
        new: 'border-transparent bg-green-500/20 text-green-400',
        completed: 'border-transparent bg-blue-500/20 text-blue-400',
        ongoing: 'border-transparent bg-emerald-500/20 text-emerald-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
