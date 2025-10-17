'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface PreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
}

const giftSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'O nome deve ter no mínimo 3 caracteres'),
  link: z.string().min(1, 'Link do produto é obrigatório').url('Link inválido'),
  image: z
    .string()
    .min(1, 'URL da imagem é obrigatória')
    .url('URL da imagem inválida'),
});

type GiftFormData = z.infer<typeof giftSchema>;

interface AddGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (gift: GiftFormData) => void;
}

export function AddGiftModal({ isOpen, onClose, onAdd }: AddGiftModalProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [linkValue, setLinkValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
  });

  const watchedLink = watch('link');

  const onSubmit = async (data: GiftFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simula requisição
      onAdd(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar presente:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setPreview(null);
      setLinkValue('');
      onClose();
    }
  };

  // Função para buscar preview da URL
  const fetchPreview = async (url: string) => {
    if (!url) return;

    try {
      // Validar se é uma URL válida
      new URL(url);
    } catch {
      return; // URL inválida, não faz nada
    }

    setIsLoadingPreview(true);
    try {
      const response = await fetch(
        `/api/preview?url=${encodeURIComponent(url)}`,
      );
      if (response.ok) {
        const data: PreviewData = await response.json();
        setPreview(data);

        // Preencher automaticamente os campos se estiverem vazios
        if (data.title && !watch('name')) {
          setValue('name', data.title);
        }
        if (data.image && !watch('image')) {
          setValue('image', data.image);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar preview:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Detectar mudanças no campo de link
  useEffect(() => {
    if (watchedLink && watchedLink !== linkValue) {
      setLinkValue(watchedLink);
      const timeoutId = setTimeout(() => {
        fetchPreview(watchedLink);
      }, 800); // Debounce de 800ms

      return () => clearTimeout(timeoutId);
    }
  }, [watchedLink]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Presente</DialogTitle>
          <DialogDescription>
            Preencha os dados do presente que deseja adicionar à sua lista.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.link}>
              <FieldLabel htmlFor="link">Link do Produto</FieldLabel>
              <Input
                id="link"
                type="url"
                placeholder="https://exemplo.com/produto"
                aria-invalid={!!errors.link}
                {...register('link')}
              />
              {errors.link && <FieldError>{errors.link.message}</FieldError>}
              {isLoadingPreview && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Carregando preview...</span>
                </div>
              )}
            </Field>

            {/* Preview do Produto */}
            {preview && !isLoadingPreview && (
              <div className="border border-border rounded-lg p-4 bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Preview do Produto
                </p>
                <div className="flex gap-3">
                  {preview.image && (
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-background shrink-0">
                      <img
                        src={preview.image}
                        alt={preview.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">
                      {preview.title}
                    </h4>
                    {preview.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {preview.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Adicionar Presente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
