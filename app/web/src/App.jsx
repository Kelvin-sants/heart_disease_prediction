import { useEffect, useState } from 'react'

export default function App() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    let cancelled = false

    async function checkApi() {
      try {
        const response = await fetch('/api/health', { signal: controller.signal })
        if (!response.ok || (await response.json()).status !== 'ok') {
          throw new Error('API indisponível')
        }
        if (!cancelled) setStatus('connected')
      } catch {
        if (!cancelled) setStatus('disconnected')
      } finally {
        clearTimeout(timeout)
      }
    }

    checkApi()

    return () => {
      cancelled = true
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  const messages = {
    checking: 'Verificando conexão com a API...',
    connected: 'API conectada com sucesso.',
    disconnected: 'Não foi possível conectar à API.',
  }

  return (
    <main>
      <h1>Predição de risco cardíaco</h1>
      <p className={`status status--${status}`} role="status" aria-live="polite">
        {messages[status]}
      </p>
    </main>
  )
}
