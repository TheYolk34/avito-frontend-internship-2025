import { Routes, Route } from 'react-router-dom'
import BoardsPage from '../pages/BoardsPage'
import BoardPage from '../pages/BoardPage'
import TasksPage from '../pages/TasksPage'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/boards" element={<BoardsPage />} />
      <Route path="/boards/:boardId" element={<BoardPage />} /> {/* Унифицировали путь */}
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  )
}

export default AppRouter