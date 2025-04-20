import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useBoards, Board } from '../api/boards'
import { useTasks, Task } from '../api/tasks'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'
import EditTaskForm from '../components/EditTaskForm'

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const { state } = useLocation()
  const queryClient = useQueryClient()
  const { data: boards, isLoading: boardsLoading, error: boardsError } = useBoards()
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks()

  const [openTask, setOpenTask] = useState<Task | null>(null)

  const board = boards?.find((b: Board) => b.id === parseInt(boardId || '0'))
  const boardTasks = tasks?.filter((task: Task) => task.boardId === parseInt(boardId || '0')) || []

  useEffect(() => {
    if (state?.openTaskId && boardTasks) {
      const taskToOpen = boardTasks.find((task: Task) => task.id === state.openTaskId)
      if (taskToOpen) {
        setOpenTask(taskToOpen)
      }
    }
  }, [state, boardTasks])

  if (boardsLoading || tasksLoading) return <div>Loading...</div>
  if (boardsError) return <div>Error: {(boardsError as Error).message}</div>
  if (tasksError) return <div>Error: {(tasksError as Error).message}</div>

  const handleTaskClick = (task: Task) => {
    setOpenTask(task)
  }

  const handleClose = () => {
    setOpenTask(null)
    queryClient.invalidateQueries({ queryKey: ['tasks', parseInt(boardId || '0')] })
  }

  const toDoTasks = boardTasks?.filter((task: Task) => task.status === 'To do') || []
  const inProgressTasks = boardTasks?.filter((task: Task) => task.status === 'In progress') || []
  const doneTasks = boardTasks?.filter((task: Task) => task.status === 'Done') || []

  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">{board ? board.name : 'Board'}</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{board?.description}</Typography>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: 2,
          overflowY: 'auto',
          maxHeight: '70vh',
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.main',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
        }}
      >
        <Box sx={{ flex: 1, border: '1px solid #000', p: 1 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>To do</Typography>
          {toDoTasks.length ? (
            toDoTasks.map((task: Task) => (
              <Card
                key={task.id}
                sx={{
                  mb: 2,
                  boxShadow: 'none',
                  border: '2px solid #4ba7f6',
                }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>{task.title}</Typography>
                  <Button onClick={() => handleTaskClick(task)} variant="outlined" sx={{ mt: 1, display: 'block', mx: 'auto' }}>
                    Редактировать Здачу
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ textAlign: 'center' }}>Нет задач</Typography>
          )}
        </Box>

        <Box sx={{ flex: 1, border: '1px solid #000', p: 1 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>In progress</Typography>
          {inProgressTasks.length ? (
            inProgressTasks.map((task: Task) => (
              <Card
                key={task.id}
                sx={{
                  mb: 2,
                  boxShadow: 'none',
                  border: '2px solid #4ba7f6',
                }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>{task.title}</Typography>
                  <Button onClick={() => handleTaskClick(task)} variant="outlined" sx={{ mt: 1, display: 'block', mx: 'auto' }}>
                    Редактировать Здачу
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ textAlign: 'center' }}>Нет задач</Typography>
          )}
        </Box>

        <Box sx={{ flex: 1, border: '1px solid #000', p: 1 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>Done</Typography>
          {doneTasks.length ? (
            doneTasks.map((task: Task) => (
              <Card
                key={task.id}
                sx={{
                  mb: 2,
                  boxShadow: 'none',
                  border: '2px solid #4ba7f6',
                }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>{task.title}</Typography>
                  <Button onClick={() => handleTaskClick(task)} variant="outlined" sx={{ mt: 1, display: 'block', mx: 'auto' }}>
                    Редактировать Здачу
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ textAlign: 'center' }}>Нет задач</Typography>
          )}
        </Box>
      </Box>

      {openTask && (
        <EditTaskForm open={!!openTask} onClose={handleClose} task={openTask} />
      )}
    </Box>
  )
}

export default BoardPage