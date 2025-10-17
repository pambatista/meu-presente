import type { NextApiRequest, NextApiResponse } from 'next';

interface PreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PreviewData | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Validar URL
    new URL(url);

    // Fazer fetch do HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }

    const html = await response.text();

    // Extrair Open Graph tags
    const ogTitle =
      html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i)?.[1];

    const ogDescription =
      html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i)?.[1];

    const ogImage =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i)?.[1];

    // Fallback para tags padrão
    const title =
      ogTitle ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ||
      'Sem título';

    const description =
      ogDescription ||
      html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i)?.[1] ||
      '';

    const image =
      ogImage ||
      html.match(/<link\s+rel=["']image_src["']\s+href=["']([^"']+)["']/i)?.[1] ||
      '';

    // Garantir que a imagem seja uma URL absoluta
    let absoluteImage = image;
    if (image && !image.startsWith('http')) {
      const baseUrl = new URL(url);
      absoluteImage = new URL(image, baseUrl.origin).toString();
    }

    return res.status(200).json({
      title: title.trim(),
      description: description.trim(),
      image: absoluteImage,
      url,
    });
  } catch (error) {
    console.error('Error fetching preview:', error);
    return res.status(500).json({
      error: 'Failed to fetch preview data',
    });
  }
}
