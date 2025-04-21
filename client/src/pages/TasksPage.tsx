import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useTasks, Task } from '../api/tasks'
import { Card, CardContent, Typography, Button, Box, TextField, Modal } from '@mui/material'
import CreateTaskForm from '../components/CreateTaskForm'
import EditTaskForm from '../components/EditTaskForm'
import TaskFilters from '../components/tasks/taskFilters'

const TasksPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: tasks, isLoading, error } = useTasks()
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [boardFilter, setBoardFilter] = useState<number | ''>('')
  const [titleSearch, setTitleSearch] = useState<string>('')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('')

  useEffect(() => {
    if (tasks) {
      console.log('Tasks:', tasks)
      tasks.forEach((task) => {
        console.log(`Task ID: ${task.id}, Assignee:`, task.assignee)
      })
    }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    return tasks.filter((task: Task) => {
      const matchesStatus = statusFilter ? task.status === statusFilter : true
      const matchesBoard = boardFilter ? task.boardId === boardFilter : true
      const matchesTitle = titleSearch ? task.title.toLowerCase().includes(titleSearch.toLowerCase()) : true
      const matchesAssignee = assigneeFilter
        ? task.assignee?.fullName?.toLowerCase().includes(assigneeFilter.toLowerCase())
        : true
      return matchesStatus && matchesBoard && matchesTitle && matchesAssignee
    })
  }, [tasks, statusFilter, boardFilter, titleSearch, assigneeFilter])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
  }

  const handleCreateTask = () => {
    setIsCreatingTask(true)
  }

  const handleCloseTaskForm = () => {
    setSelectedTask(undefined)
    setIsCreatingTask(false)
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  const handleBoardClick = (task: Task) => {
    navigate(`/boards/${task.boardId}`, { state: { openTaskId: task.id } })
  }

  return (
    <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, marginLeft: 8 }}>
          <TextField
            placeholder="Поиск по Названию"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            variant="outlined"
            sx={{
              width: 300,
              backgroundColor: 'white',
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                height: '100%',
                borderRadius: '20px',
                paddingRight: 0,
                '& fieldset': {
                  borderColor: '#00aaff',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: '#00aaff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00aaff',
                },
              },
              '& input': {
                padding: '14px 18px',
                color: '#222',
                fontSize: '1.2rem',
              },
            }}
          />
          <TextField
            placeholder="Поиск по Исполнителю"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            variant="outlined"
            sx={{
              width: 300,
              backgroundColor: 'white',
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                height: '100%',
                borderRadius: '20px',
                paddingRight: 0,
                '& fieldset': {
                  borderColor: '#00aaff',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: '#00aaff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00aaff',
                },
              },
              '& input': {
                padding: '14px 18px',
                color: '#222',
                fontSize: '1.2rem',
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsFiltersOpen(true)}
          sx={{
            alignSelf: 'flex-end',
            width: 130,
            backgroundColor: 'black',
            color: 'white',
            fontSize: '1.1rem',
            padding: '12px 24px',
            borderRadius: '30px',
            boxShadow: 'none',
            marginRight: 20,
            '&:hover': {
              backgroundColor: '#333',
              boxShadow: 'none',
            },
          }}
        >
          Фильтры
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          border: 'none',
          borderRadius: 2,
          overflowY: 'auto',
          p: 1.125,
          mb: 1,
          maxHeight: '355px',
          width: '80%',
          alignSelf: 'center',
          '&::-webkit-scrollbar': {
            width: '14px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#00A8FF',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'white',
          },
        }}
      >
        {filteredTasks.length ? (
          filteredTasks.map((task: Task) => (
            <Card
              key={task.id}
              sx={{
                mt: 0.75,
                mb: 0.75,
                boxShadow: 'none',
                border: 'none',
                borderRadius: '20px',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 0,
                }}
              >
                <Box sx={{ ml: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '1rem', color: 'text.secondary', mt: 0.5 }}>
                    Исполнитель: {task.assignee?.fullName || 'Не назначен'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mr: 2, alignItems: 'center' }}>
                  <Button
                    onClick={() => handleEditTask(task)}
                    variant="contained"
                    size="small"
                    sx={{
                      mt: 3,
                      width: 200,
                      backgroundColor: '#ededed',
                      color: 'black',
                      boxShadow: 'none',
                      fontWeight: 750,
                      fontSize: '12px',
                      '&:hover': {
                        backgroundColor: '#d5d5d5',
                      },
                    }}
                  >
                    Редактировать задачу
                  </Button>
                  <Button
                    onClick={() => handleBoardClick(task)}
                    variant="contained"
                    size="small"
                    sx={{
                      width: 200,
                      backgroundColor: '#ededed',
                      color: 'black',
                      boxShadow: 'none',
                      fontWeight: 750,
                      fontSize: '12px',
                      '&:hover': {
                        backgroundColor: '#d5d5d5',
                      },
                    }}
                  >
                    Перейти к доске
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>Нет доступных задач</Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20, mt: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTask}
          sx={{
            width: 250,
            backgroundColor: 'black',
            color: 'white',
            fontSize: '1.1rem',
            padding: '12px 24px',
            borderRadius: '30px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#333',
              boxShadow: 'none',
            },
          }}
        >
          Создать задачу
        </Button>
      </Box>
      {selectedTask && (
        <EditTaskForm open={!!selectedTask} onClose={handleCloseTaskForm} task={selectedTask} />
      )}
      {isCreatingTask && (
        <CreateTaskForm open={isCreatingTask} onClose={handleCloseTaskForm} />
      )}
      <Modal open={isFiltersOpen} onClose={() => setIsFiltersOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            minWidth: 400,
          }}
        >
          <TaskFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            boardFilter={boardFilter}
            setBoardFilter={setBoardFilter}
          />
          <Button
            variant="contained"
            onClick={() => setIsFiltersOpen(false)}
            sx={{
              mt: 2,
              width: 250,
              backgroundColor: '#00A8FF',
              fontSize: '1rem',
              padding: '12px 24px',
              borderRadius: '30px',
              boxShadow: 'none',
              mx: 'auto',
              display: 'block',
              '&:hover': {
                backgroundColor: '#0090e5',
                boxShadow: 'none',
              },
            }}
          >
            Применить фильтры
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default TasksPage