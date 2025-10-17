import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Gift } from '@/lib/supabase';

interface UpdateGiftRequest {
  name?: string;
  link?: string;
  image?: string;
}

interface DeleteResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Gift | DeleteResponse | ErrorResponse>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID é obrigatório' });
  }

  // Pegar token do header
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Criar cliente Supabase com o token do usuário
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  // PUT - Atualizar presente
  if (req.method === 'PUT') {
    const { name, link, image }: UpdateGiftRequest = req.body;

    if (!name && !link && !image) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    try {
      const updateData: UpdateGiftRequest & { updated_at: string } = {
        updated_at: new Date().toISOString(),
      };

      if (name) updateData.name = name;
      if (link) updateData.link = link;
      if (image) updateData.image = image;

      const { data, error } = await supabase
        .from('gifts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Presente não encontrado' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Update gift error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar presente' });
    }
  }

  // DELETE - Deletar presente
  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase.from('gifts').delete().eq('id', id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Presente deletado com sucesso' });
    } catch (error) {
      console.error('Delete gift error:', error);
      return res.status(500).json({ error: 'Erro ao deletar presente' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
