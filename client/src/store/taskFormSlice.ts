import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskFormState {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  boardId: number | undefined;
}

const initialState: TaskFormState = {
  title: '',
  description: '',
  status: 'Backlog',
  priority: '',
  assignee: '',
  boardId: undefined,
};

// Utility to save state to localStorage
const saveToLocalStorage = (state: TaskFormState) => {
  try {
    localStorage.setItem('taskFormDraft', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save task form draft to localStorage:', error);
  }
};

// Utility to load state from localStorage
const loadFromLocalStorage = (): TaskFormState | undefined => {
  try {
    const serializedState = localStorage.getItem('taskFormDraft');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState) as TaskFormState;
  } catch (error) {
    console.error('Failed to load task form draft from localStorage:', error);
    return undefined;
  }
};

// Utility to clear localStorage
const clearLocalStorage = () => {
  try {
    localStorage.removeItem('taskFormDraft');
  } catch (error) {
    console.error('Failed to clear task form draft from localStorage:', error);
  }
};

const taskFormSlice = createSlice({
  name: 'taskForm',
  initialState,
  reducers: {
    updateForm(state, action: PayloadAction<Partial<TaskFormState>>) {
      const newState = { ...state, ...action.payload };
      saveToLocalStorage(newState); // Save to localStorage on every update
      return newState;
    },
    resetForm() {
      clearLocalStorage(); // Clear localStorage on reset
      return initialState;
    },
    loadPersistedForm(state) {
      const persistedState = loadFromLocalStorage();
      if (persistedState) {
        return { ...state, ...persistedState };
      }
      return state;
    },
  },
});

export const { updateForm, resetForm, loadPersistedForm } = taskFormSlice.actions;
export default taskFormSlice.reducer;