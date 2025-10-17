'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { GiftCard } from '@/components/gift-card';
import { Button } from '@/components/ui/button';
import { AddGiftModal } from '@/components/add-gift-modal';

// Dados mockados para exemplo
const initialGifts = [
  {
    id: '1',
    name: 'Notebook Dell Inspiron',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    link: 'https://example.com/notebook',
  },
  {
    id: '2',
    name: 'Fone de Ouvido Sony',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    link: 'https://example.com/fone',
  },
  {
    id: '3',
    name: 'Smartwatch Apple Watch',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
    link: 'https://example.com/watch',
  },
  {
    id: '4',
    name: 'Câmera Canon EOS',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    link: 'https://example.com/camera',
  },
  {
    id: '5',
    name: 'Teclado Mecânico RGB',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    link: 'https://example.com/teclado',
  },
  {
    id: '6',
    name: 'Mouse Gamer Logitech',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    link: 'https://example.com/mouse',
  },
];

export default function MeusPresentesPage() {
  const [gifts, setGifts] = useState(initialGifts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (id: string) => {
    console.log('Editar presente:', id);
    // Aqui você pode adicionar a lógica de edição
    // Por exemplo, abrir um modal ou navegar para página de edição
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este presente?')) {
      setGifts(gifts.filter((gift) => gift.id !== id));
      console.log('Presente excluído:', id);
    }
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleAddGift = (giftData: { name: string; link: string; image: string }) => {
    const newGift = {
      id: String(Date.now()),
      ...giftData,
    };
    setGifts([newGift, ...gifts]);
    console.log('Presente adicionado:', newGift);
  };

  return (
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
        {gifts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gifts.map((gift) => (
              <GiftCard
                key={gift.id}
                id={gift.id}
                name={gift.name}
                image={gift.image}
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
            <Button onClick={handleAddNew} className="mt-4">
              <Plus className="size-5 mr-2" />
              Adicionar Primeiro Presente
            </Button>
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
  );
}
