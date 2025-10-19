import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Gift } from '@/lib/supabase';
import formidable from 'formidable';
import fs from 'fs/promises';

interface CreateGiftRequest {
  name: string;
  link: string;
  image: string;
  user_id: string;
}

interface ErrorResponse {
  error: string;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Gift | Gift[] | ErrorResponse>,
) {
  // Pegar token do header
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Criar cliente Supabase com o token do usuário (para operações de banco)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  );

  // Criar cliente Supabase com Service Role Key (para operações de Storage)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
    try {
      let name: string;
      let link: string;
      let imageUrl: string = '';
      let user_id: string;
      let uploadedFile: formidable.File | null = null;

      // Processar FormData

      const form = formidable({
        maxFileSize: 5 * 1024 * 1024, // 5MB
        filter: ({ mimetype }) => {
          return mimetype ? mimetype.startsWith('image/') : false;
        },
      });

      const [fields, files] = await form.parse(req);

      name = fields.name?.[0] || '';
      link = fields.link?.[0] || '';
      user_id = fields.user_id?.[0] || '';
      uploadedFile = files.imageFile?.[0] || null;
      imageUrl = fields.imageUrl?.[0] || '';

      if (!name || !link || !user_id) {
        return res
          .status(400)
          .json({ error: 'Nome, link e user_id são obrigatórios' });
      }

      // Se tiver arquivo, fazer upload para o Supabase Storage
      if (uploadedFile) {
        try {
          // Ler o arquivo
          const fileBuffer = await fs.readFile(uploadedFile.filepath);

          // Detectar extensão do arquivo
          const mimeType = uploadedFile.mimetype || 'image/jpeg';
          const extension = mimeType.split('/')[1] || 'jpg';

          // Gerar nome único para o arquivo
          const fileName = `${user_id}/${Date.now()}.${extension}`;

          // Upload para o Supabase Storage usando Service Role Key
          const { error: uploadError } = await supabaseAdmin.storage
            .from('gift-images')
            .upload(fileName, fileBuffer, {
              contentType: mimeType,
              upsert: false,
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            return res
              .status(400)
              .json({ error: 'Erro ao fazer upload da imagem' });
          }

          // Obter URL pública da imagem
          const { data: urlData } = supabaseAdmin.storage
            .from('gift-images')
            .getPublicUrl(fileName);

          imageUrl = urlData.publicUrl;

          // Limpar arquivo temporário
          await fs.unlink(uploadedFile.filepath);
        } catch (uploadError) {
          console.error('Image processing error:', uploadError);
          return res.status(400).json({ error: 'Erro ao processar imagem' });
        }
      }

      if (!imageUrl) {
        return res.status(400).json({ error: 'Imagem é obrigatória' });
      }

      // Inserir presente no banco
      const { data, error } = await supabase
        .from('gifts')
        .insert({
          name,
          link,
          image: imageUrl,
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
