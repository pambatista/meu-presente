import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Gift as GiftIcon, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Gift } from '@/lib/supabase';

export default function PublicListPage() {
  const router = useRouter();
  const { userId } = router.query;
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (userId && typeof userId === 'string') {
      fetchPublicGifts(userId);
    }
  }, [userId]);

  const fetchPublicGifts = async (id: string) => {
    try {
      const response = await fetch(`/api/gifts/public/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGifts(data.gifts);
        setUserName(data.userName);
      }
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando lista...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <GiftIcon className="size-5" />
              </div>
              <span className="font-bold text-lg">Meu Presente</span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Cabeçalho da Lista */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              Lista de Presentes {userName && `de ${userName}`}
            </h1>
            <p className="text-muted-foreground">
              Escolha um presente e clique para visualizar o produto
            </p>
          </div>

          {/* Grid de Presentes */}
          {gifts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Imagem */}
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={gift.image}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/400?text=Sem+Imagem';
                      }}
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem]">
                      {gift.name}
                    </h3>

                    {/* Botão */}
                    <Button
                      className="w-full"
                      onClick={() => window.open(gift.link, '_blank')}
                    >
                      <ExternalLink className="size-4 mr-2" />
                      Ver Produto
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GiftIcon className="size-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                Nenhum presente na lista ainda.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>
            Crie sua própria lista de presentes em{' '}
            <a href="/login" className="text-primary hover:underline">
              Meu Presente
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
