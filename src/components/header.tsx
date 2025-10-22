import { Logo } from '@/components/logo';
import { AuthButton } from '@/components/auth-button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
