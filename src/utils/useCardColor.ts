import { useTheme } from '@sanity/ui'

export function useCardColor() {
  return useTheme().sanity.color.card.enabled
}
