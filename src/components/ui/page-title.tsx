import { cn } from '@/lib/utils';

type PageTitleProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={cn('space-y-2 mb-6', className)}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
