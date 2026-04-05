import { useState } from 'react'

export function useOpenGraph() {
  const [isFetchingOg, setIsFetchingOg] = useState(false)
  const [ogError, setOgError] = useState('')

  const fetchMetadata = async (url: string): Promise<{ title: string; image: string } | null> => {
    setIsFetchingOg(true)
    setOgError('')
    try {
      const appId = import.meta.env.VITE_OPENGRAPH_ID
      if (!appId) throw new Error('No OpenGraph API ID found in environment.')
      const encodedUrl = encodeURIComponent(url)
      const res = await fetch(`https://opengraph.io/api/1.1/site/${encodedUrl}?app_id=${appId}`)
      if (!res.ok) throw new Error('Failed to fetch OpenGraph data.')
      const data = await res.json()
      if (data.hybridGraph) {
        return {
          title: data.hybridGraph.title || '',
          image: data.hybridGraph.image || '',
        }
      }
      return null
    } catch (err) {
      console.error(err)
      setOgError('Could not automatically fill recipe details from URL. Please enter them manually.')
      return null
    } finally {
      setIsFetchingOg(false)
    }
  }

  const clearOgError = () => setOgError('')

  return { isFetchingOg, ogError, setOgError, fetchMetadata, clearOgError }
}
