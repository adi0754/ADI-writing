import { defineConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { webcrypto } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import processHandler from './api/process'
import providersHandler from './api/providers'
import listModelsHandler from './api/list-models'
import healthHandler from './api/health'

if (typeof globalThis.crypto === 'undefined') {
  // Polyfill for environments missing Web Crypto (Node <18)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.crypto = webcrypto
}

type RouteHandler = (req: VercelRequest, res: VercelResponse) => void | Promise<void>

const normalizePath = (pathname: string): string => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

const buildQueryObject = (params: URLSearchParams): Record<string, string | string[]> => {
  const query: Record<string, string | string[]> = {}
  params.forEach((value, key) => {
    const existing = query[key]
    if (existing === undefined) {
      query[key] = value
    } else if (Array.isArray(existing)) {
      existing.push(value)
    } else {
      query[key] = [existing, value]
    }
  })
  return query
}

const readRequestBody = (req: IncomingMessage): Promise<any> => {
  const method = (req.method ?? 'GET').toUpperCase()
  if (method === 'GET' || method === 'HEAD') {
    return Promise.resolve(undefined)
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', chunk => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    })
    req.on('end', () => {
      if (!chunks.length) {
        resolve(undefined)
        return
      }

      const raw = Buffer.concat(chunks).toString()
      if (!raw) {
        resolve(undefined)
        return
      }

      const contentType = req.headers['content-type'] ?? ''
      if (typeof raw === 'string' && contentType.includes('application/json')) {
        try {
          resolve(JSON.parse(raw))
        } catch {
          resolve(raw)
        }
        return
      }

      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve(raw)
      }
    })
    req.on('error', reject)
  })
}

const enhanceResponse = (res: ServerResponse<IncomingMessage>): VercelResponse => {
  const vercelRes = res as VercelResponse

  if (typeof vercelRes.status !== 'function') {
    vercelRes.status = (code: number) => {
      res.statusCode = code
      return vercelRes
    }
  }

  if (typeof vercelRes.json !== 'function') {
    vercelRes.json = body => {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
      }
      res.end(JSON.stringify(body))
      return vercelRes
    }
  }

  if (typeof vercelRes.send !== 'function') {
    vercelRes.send = body => {
      if (typeof body === 'object' && body !== null) {
        return vercelRes.json(body)
      }
      if (!res.headersSent && typeof body === 'string') {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      }
      res.end(body)
      return vercelRes
    }
  }

  return vercelRes
}

const localApiPlugin = (): PluginOption => ({
  name: 'local-vercel-api',
  apply: 'serve',
  configureServer(server) {
    const routes: Record<string, RouteHandler> = {
      '/api/health': healthHandler,
      '/api/process': processHandler,
      '/api/providers': providersHandler,
      '/api/list-models': listModelsHandler,
    }

    server.middlewares.use((req, res, next) => {
      if (!req.url || !req.url.startsWith('/api/')) {
        next()
        return
      }

      const handleRequest = async () => {
        const parsedUrl = new URL(req.url ?? '', `http://${req.headers.host ?? 'localhost'}`)
        const routeKey = normalizePath(parsedUrl.pathname)
        const handler = routes[routeKey]

        if (!handler) {
          const vercelRes = enhanceResponse(res)
          vercelRes.status(404).json({
            error: 'NOT_FOUND',
            message: `No local handler configured for ${routeKey}`,
          })
          return
        }

        const vercelReq = req as VercelRequest
        vercelReq.query = buildQueryObject(parsedUrl.searchParams)
        vercelReq.cookies = vercelReq.cookies ?? {}
        vercelReq.body = await readRequestBody(req)

        const vercelRes = enhanceResponse(res)
        await handler(vercelReq, vercelRes)
      }

      handleRequest().catch(error => {
        console.error('[local-vercel-api] Handler error:', error)
        const vercelRes = enhanceResponse(res)
        if (!res.headersSent) {
          vercelRes.status(500).json({
            error: 'LOCAL_API_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error',
          })
        } else {
          res.end()
        }
      })
    })
  },
})

export default defineConfig({
  plugins: [vue(), localApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
