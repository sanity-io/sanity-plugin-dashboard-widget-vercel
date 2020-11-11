import fetch from 'unfetch'

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.SANITY_STUDIO_VERCEL_TOKEN}`,
    },
  }).then(r => r.json())

export default fetcher
