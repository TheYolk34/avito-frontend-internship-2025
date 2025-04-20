import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TaskFormState {
  title: string
  description: string
  status: string
  priority: string
  assignee: string // Оставляем строку, так как форма работает со строками
  boardId: number
}

const initialState: TaskFormState = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'LOW',
  assignee: '',
  boardId: 0,
}

const taskFormSlice = createSlice({
  name: 'taskForm',
  initialState,
  reducers: {
    updateForm(state, action: PayloadAction<Partial<TaskFormState>>) {
      return { ...state, ...action.payload }
    },
    resetForm() {
      return initialState
    },
  },
})

export const { updateForm, resetForm } = taskFormSlice.actions
export default taskFormSlice.reducer