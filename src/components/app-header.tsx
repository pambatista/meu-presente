'use client';

import { Gift, LogOut, User, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const activeLink = pathname;
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleShare = () => {
    if (!user) return;

    const shareUrl = `${window.location.origin}/lista/${user.id}`;

    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copiado!', {
      description: 'Compartilhe com seus amigos e familiares',
      classNames: {
        'description': '!text-slate-700',
      },
    });
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
            {/* <Button
              variant={
                activeLink === '/app/meus-presentes' ? 'default' : 'ghost'
              }
              size="sm"
              onClick={() => router.push('/app/meus-presentes')}
              title="Meus Presentes"
            >
              <Gift className="size-5" />
              <span className="font-medium text-sm">Meus Presentes</span>
            </Button> */}

            {/* Botão Perfil */}
            {/* <Button
              variant={activeLink === '/app/perfil' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => router.push('/app/perfil')}
              title="Perfil"
            >
              <User className="size-5" />
              <span className="font-medium text-sm">Perfil</span>
            </Button> */}

            {/* Botão Compartilhar */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              title="Compartilhar Lista"
            >
              <Share2 className="size-5" />
              <span className="font-medium text-sm">Compartilhar</span>
            </Button>

            {/* Botão Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut className="size-5" />
              <span className="font-medium text-sm">Sair</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
