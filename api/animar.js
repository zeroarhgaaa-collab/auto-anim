export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo no permitido' });
  const { prompt, imgUrl } = req.body;
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: 'Falta FAL_KEY en Vercel' });

  const modelo = imgUrl ? 'https://fal.run' : 'https://fal.run';
  const cuerpo = imgUrl ? { prompt: prompt, image_url: imgUrl } : { prompt: prompt };

  try {
    const resp = await fetch(modelo, {
      method: 'POST',
      headers: {
        'Authorization': 'Key ' + FAL_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cuerpo)
    });
    const data = await resp.json();
    if (data.video && data.video.url) {
      return res.status(200).json({ videoUrl: data.video.url });
    }
    return res.status(400).json({ error: 'No se pudo generar el video' });
  } catch (e) {
    return res.status(500).json({ error: 'Error interno' });
  }
}
