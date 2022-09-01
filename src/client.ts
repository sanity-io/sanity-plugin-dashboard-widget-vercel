import type { SanityClient } from '@sanity/client'
import { API_VERSION } from './constants'
import { useClient } from 'sanity'
import { useMemo } from 'react'

export function useSanityClient(): SanityClient {
  const client = useClient()
  return useMemo(() => client.withConfig({ apiVersion: API_VERSION }), [client])
}
