import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
})

export interface Board {
  id: number
  name: string
  description: string
  taskCount: number
}

export const fetchBoards = async (): Promise<Board[]> => {
  const { data } = await api.get('/boards')
  return data.data
}

export const useBoards = () => {
  return useQuery({ queryKey: ['boards'], queryFn: fetchBoards })
}