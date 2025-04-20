import { render, screen, fireEvent } from '@testing-library/react'
   import BoardsPage from './BoardsPage'
   import { QueryClient, QueryClientProvider } from 'react-query'
   import { BrowserRouter } from 'react-router-dom'

   const queryClient = new QueryClient()

   describe('BoardsPage', () => {
     it('renders correctly', () => {
       render(
         <QueryClientProvider client={queryClient}>
           <BrowserRouter>
             <BoardsPage />
           </BrowserRouter>
         </QueryClientProvider>
       )
       expect(screen.getByText('Boards')).toBeInTheDocument()
       expect(screen.getByText('Create Board')).toBeInTheDocument()
     })

     it('opens board form on button click', () => {
       render(
         <QueryClientProvider client={queryClient}>
           <BrowserRouter>
             <BoardsPage />
           </BrowserRouter>
         </QueryClientProvider>
       )
       fireEvent.click(screen.getByText('Create Board'))
       expect(screen.getByText('Create Board')).toBeInTheDocument()
       expect(screen.getByLabelText('Title')).toBeInTheDocument()
     })
   })