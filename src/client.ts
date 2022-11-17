import type {SanityClient} from '@sanity/client'
import {API_VERSION} from './constants'
import {useClient} from 'sanity'

export function useSanityClient(): SanityClient {
  return useClient({apiVersion: API_VERSION})
}
