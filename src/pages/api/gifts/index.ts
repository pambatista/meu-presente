import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Gift } from '@/lib/supabase';

interface CreateGiftRequest {
  name: string;
  link: string;
  image: string;
  user_id: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Gift | Gift[] | ErrorResponse>
) {
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

  // GET - Listar presentes do usuário
  if (req.method === 'GET') {
    const { user_id } = req.query;

    if (!user_id || typeof user_id !== 'string') {
      return res.status(400).json({ error: 'user_id é obrigatório' });
    }

    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Get gifts error:', error);
      return res.status(500).json({ error: 'Erro ao buscar presentes' });
    }
  }

  // POST - Criar novo presente
  if (req.method === 'POST') {
    const { name, link, image, user_id }: CreateGiftRequest = req.body;

    if (!name || !link || !image || !user_id) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
      const { data, error } = await supabase
        .from('gifts')
        .insert({
          name,
          link,
          image,
          user_id,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(400).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error('Create gift error:', error);
      return res.status(500).json({ error: 'Erro ao criar presente' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
