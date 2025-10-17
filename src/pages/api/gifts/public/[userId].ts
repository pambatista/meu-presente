import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { Gift } from '@/lib/supabase';

interface PublicListResponse {
  gifts: Gift[];
  userName: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PublicListResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId é obrigatório' });
  }

  try {
    // Buscar presentes do usuário
    const { data: gifts, error: giftsError } = await supabase
      .from('gifts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (giftsError) {
      return res.status(400).json({ error: giftsError.message });
    }

    // Buscar nome do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();

    const userName = profile?.name || '';

    return res.status(200).json({
      gifts: gifts || [],
      userName,
    });
  } catch (error) {
    console.error('Get public gifts error:', error);
    return res.status(500).json({ error: 'Erro ao buscar presentes' });
  }
}
