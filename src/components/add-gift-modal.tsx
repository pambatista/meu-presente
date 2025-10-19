'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload } from 'lucide-react';
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
  image: z.string().optional(),
});

type GiftFormData = z.infer<typeof giftSchema>;

interface AddGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (gift: GiftFormData & { imageFile?: File }) => void;
}

export function AddGiftModal({ isOpen, onClose, onAdd }: AddGiftModalProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [previewFailed, setPreviewFailed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      if (!data.image && !selectedFile) {
        alert('Por favor, adicione uma imagem do produto');
        return;
      }
      onAdd({
        ...data,
        imageFile: selectedFile || undefined,
      });
      reset();
      setPreview(null);
      setPreviewFailed(false);
      setSelectedFile(null);
      setImagePreview(null);
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
      setPreviewFailed(false);
      setSelectedFile(null);
      setImagePreview(null);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      setSelectedFile(file);

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para buscar preview da URL
  const fetchPreview = async (url: string) => {
    if (!url) return;

    setIsLoadingPreview(true);
    setPreviewFailed(false);
    try {
      const response = await fetch(
        `/api/preview?url=${encodeURIComponent(url)}`,
      );
      if (response.ok) {
        const data: PreviewData = await response.json();
        setPreview(data);
        setPreviewFailed(false);

        if (data.title === 'Sem título') {
          setValue('name', '');
          setValue('image', '');
          setPreview(null);
          setPreviewFailed(true);
        }

        // Preencher automaticamente os campos se estiverem vazios
        if (data.title && data.title !== 'Sem título' && !watch('name')) {
          setValue('name', data.title);
        }
        if (data.image && !watch('image')) {
          setValue('image', data.image);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar preview:', error);
      setPreview(null);
      setPreviewFailed(true);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Detectar mudanças no campo de link
  useEffect(() => {
    if (watchedLink && watchedLink !== linkValue) {
      setLinkValue(watchedLink);

      fetchPreview(watchedLink);
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

            {/* Campos manuais quando preview falha */}
            {previewFailed && !isLoadingPreview && (
              <>
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="name">Nome do Produto</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite o nome do produto"
                    aria-invalid={!!errors.name}
                    {...register('name')}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="image-upload">
                    Imagem do Produto
                  </FieldLabel>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Upload className="size-4" />
                        <span className="text-sm">
                          {selectedFile
                            ? selectedFile.name
                            : 'Escolher arquivo'}
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {imagePreview && (
                      <div className="border border-border rounded-lg p-3 bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Preview
                        </p>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-md"
                        />
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: JPG, PNG, WebP, GIF (máx. 5MB)
                    </p>
                  </div>
                </Field>
              </>
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
            <Button type="submit" disabled={isSubmitting || !watch('name')}>
              {isSubmitting ? 'Adicionando...' : 'Adicionar Presente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
