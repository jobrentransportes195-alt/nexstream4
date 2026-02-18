
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Use Service Role para operações de Admin
);

/**
 * NEX-BRIDGE 7.5 - VERCEL EDITION
 * Tunelamento otimizado para evitar timeouts de funções serverless.
 */
const streamTunnel = async (targetUrl: string, req: express.Request, res: express.Response) => {
  if (!targetUrl) return res.status(400).send('URL requerida');

  try {
    const parsedUrl = new URL(targetUrl);
    const headers: any = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Connection': 'keep-alive',
    };

    if (req.headers.range) headers['Range'] = req.headers.range;
    headers['Referer'] = parsedUrl.origin + '/';

    const response = await fetch(targetUrl, { 
      headers,
      timeout: 10000, // Timeout reduzido para serverless
      agent: targetUrl.startsWith('https') ? new https.Agent({ rejectUnauthorized: false }) : undefined
    });

    const contentType = response.headers.get('content-type') || '';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (response.headers.get('content-range')) {
      res.setHeader('Content-Range', response.headers.get('content-range')!);
      res.status(206);
    }

    // Proxy para M3U8 (Manifest Rewriting)
    if (contentType.includes('mpegurl') || targetUrl.includes('.m3u8')) {
      const text = await response.text();
      const rewritten = text.split('\n').map(line => {
        if (line.trim().startsWith('#') || !line.trim()) return line;
        try {
          const abs = new URL(line.trim(), targetUrl).href;
          return `/api/tunnel?url=${encodeURIComponent(abs)}`;
        } catch { return line; }
      }).join('\n');
      return res.send(rewritten);
    }

    response.body.pipe(res);
  } catch (error: any) {
    res.status(502).send('Gateway Error');
  }
};

// Endpoints de API
app.get('/api/tunnel', (req, res) => streamTunnel(req.query.url as string, req, res));


  if (error) {
    return res.status(401).json({
      error: "Credenciais inválidas",
    });
  }

  res.json(data);
});

// Exportação para Vercel
export default app;
