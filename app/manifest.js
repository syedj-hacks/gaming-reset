export default function manifest() {
  return {
    name: 'Gaming Reset: Take Control of Your Gaming Habits',
    short_name: 'Gaming Reset',
    description:
      'A personalized habit-change app to spend less time gaming: simple daily steps and automated progress tracking.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070708',
    theme_color: '#070708',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
