'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/app-layout';
import { GiftCard } from '@/components/gift-card';
import { Button } from '@/components/ui/button';
import { AddGiftModal } from '@/components/add-gift-modal';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useConfirm } from '@/hooks/useConfirm';
import type { Gift } from '@/lib/supabase';

export default function MeusPresentesPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { confirm } = useConfirm();

  // Carregar presentes ao montar o componente
  useEffect(() => {
    if (user) {
      fetchGifts();
    }
  }, [user]);

  const fetchGifts = async () => {
    if (!user) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    try {
      const response = await fetch(`/api/gifts?user_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGifts(data);
      } else {
        toast.error('Erro ao carregar presentes');
      }
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
      toast.error('Erro ao carregar presentes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    console.log('Editar presente:', id);
    // TODO: Implementar modal de edição
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm(
      'Tem certeza que deseja excluir este presente?',
    );
    if (!confirmed) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    try {
      const response = await fetch(`/api/gifts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setGifts(gifts.filter((gift) => gift.id !== id));
        toast.success('Presente excluído com sucesso!');
      } else {
        toast.error('Erro ao excluir presente');
      }
    } catch (error) {
      console.error('Erro ao excluir presente:', error);
      toast.error('Erro ao excluir presente');
    }
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleAddGift = async (giftData: {
    name: string;
    link: string;
    image: string;
  }) => {
    if (!user) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...giftData,
          user_id: user.id,
        }),
      });

      if (response.ok) {
        const newGift = await response.json();
        setGifts([newGift, ...gifts]);
        toast.success('Presente adicionado com sucesso!');
      } else {
        const error = await response.json();
        console.error('API error:', error);
        toast.error(error.error || 'Erro ao adicionar presente');
      }
    } catch (error) {
      console.error('Erro ao adicionar presente:', error);
      toast.error('Erro ao adicionar presente');
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Cabeçalho da Página */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="!text-xl !font-bold !m-0">Meus Presentes</h1>
              <p className="text-muted-foreground text-sm">
                Gerencie sua lista de presentes
              </p>
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="size-5 mr-2" />
              Novo Presente
            </Button>
          </div>

          {/* Grid de Presentes */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando presentes...</p>
            </div>
          ) : gifts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gifts.map((gift) => (
                <GiftCard
                  key={gift.id}
                  id={gift.id}
                  name={gift.name}
                  image={gift.image}
                  link={gift.link}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum presente cadastrado ainda.
              </p>
            </div>
          )}
        </div>

        {/* Modal de Adicionar Presente */}
        <AddGiftModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddGift}
        />
      </AppLayout>
    </ProtectedRoute>
  );
}
