import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
})

export interface User {
  id: number
  fullName: string
  email: string
  avatarUrl: string
}

export interface Task {
  id: number
  title: string
  description: string
  status: string
  priority: string
  assignee: User
  boardId: number
}

export const fetchTasks = async (boardId?: number): Promise<Task[]> => {
  const { data } = await api.get('/tasks', { params: { boardId } })
  return data.data
}

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const { data } = await api.post('/tasks/create', task)
  return data.data
}

export const updateTask = async (task: Task): Promise<Task> => {
  const { data } = await api.put(`/tasks/update/${task.id}`, task)
  return data.data
}

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users')
  return data.data
}

export const useTasks = (boardId?: number) => {
  return useQuery({ queryKey: ['tasks', boardId], queryFn: () => fetchTasks(boardId) })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useUsers = () => {
  return useQuery({ queryKey: ['users'], queryFn: fetchUsers })
}