export default function handler(req, res) {
  if (req.method === 'GET') {
    const { url } = req.query;
    return res.json({
      short_name: 'Flexpool.io',
      name: 'Flexpool.io',
      icons: [
        {
          src: 'favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon',
        },
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '196x196_maskable.png',
          sizes: '196x196',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      display: 'standalone',
      theme_color: '#0069FF',
      background_color: '#ffffff',
      start_url: url || '/',
    });
  }
}
