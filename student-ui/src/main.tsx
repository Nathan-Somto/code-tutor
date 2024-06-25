import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from './providers/AuthProvider.tsx'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
      retry(failureCount,) { 
        if (failureCount < 3) return true
        else return false
      },
    },
  },
  }
)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} >
      <AuthProvider>
      <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
