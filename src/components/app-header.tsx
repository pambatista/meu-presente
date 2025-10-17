'use client';

import { Gift, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const activeLink = pathname;

  const handleLogout = () => {
    // Aqui você pode adicionar a lógica de logout
    console.log('Logout');
    router.push('/login');
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Nome */}
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Gift className="size-5" />
            </div>
          </div>

          {/* Menu de navegação */}
          <nav className="flex items-center gap-4">
            {/* Botão Presentes */}
            <Button
              variant={
                activeLink === '/app/meus-presentes' ? 'default' : 'ghost'
              }
              size="sm"
              onClick={() => router.push('/app/meus-presentes')}
              title="Meus Presentes"
            >
              <Gift className="size-5" />
              <span className="font-medium text-sm">Meus Presentes</span>
            </Button>

            {/* Botão Perfil */}
            <Button
              variant={activeLink === '/app/perfil' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => router.push('/app/perfil')}
              title="Perfil"
            >
              <User className="size-5" />
              <span className="font-medium text-sm">Perfil</span>
            </Button>

            {/* Botão Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut className="size-5" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
