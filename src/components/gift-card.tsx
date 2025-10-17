'use client';

import { Link, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GiftCardProps {
  id: string;
  name: string;
  image: string;
  link: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GiftCard({
  id,
  name,
  image,
  link,
  onEdit,
  onDelete,
}: GiftCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Imagem do Presente */}
      <div className="aspect-square bg-muted relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4 truncate" title={name}>
          {name}
        </h3>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(link, '_blank')}
          >
            <Link className="size-4 mr-2" />
            Visualizar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="size-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
