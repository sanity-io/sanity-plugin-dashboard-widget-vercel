import fetch from 'unfetch'

const fetcher = (token: string) => (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(r => r.json())

export default fetcher
