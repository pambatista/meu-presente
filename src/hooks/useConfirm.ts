import { toast } from 'sonner';

export function useConfirm() {
  const confirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      toast(message, {
        action: {
          label: 'Confirmar',
          onClick: () => resolve(true),
        },
        cancel: {
          label: 'Cancelar',
          onClick: () => resolve(false),
        },
        duration: 10000,
      });
    });
  };

  return { confirm };
}
