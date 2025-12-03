import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <BrainCircuit className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg text-primary font-headline">Prof T</span>
    </Link>
  );
}
