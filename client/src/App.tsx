import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store'
import Header from './components/Header'
import AppRouter from './router/AppRouter'

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Header />
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )
}

export default App