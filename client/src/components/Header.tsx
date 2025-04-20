import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { AppBar, Toolbar, Button, Box } from '@mui/material'
import CreateTaskForm from './CreateTaskForm'

const Header = () => {
  const [openTaskForm, setOpenTaskForm] = useState(false)
  const queryClient = useQueryClient()
  const location = useLocation()

  const handleOpenTaskForm = () => {
    setOpenTaskForm(true)
  }

  const handleCloseTaskForm = () => {
    setOpenTaskForm(false)
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  const isBoardsPage = location.pathname.startsWith('/boards') || location.pathname.startsWith('/board')
  const isTasksPage = location.pathname === '/tasks'

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#000' }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', width: '100%' }}>
          {/* Левая часть: Все заявки и Проекты */}
          <Box sx={{ display: 'flex', gap: 2, marginLeft: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/tasks"
              sx={{
                fontSize: '1rem',
                borderBottom: isTasksPage ? '1px solid white' : 'none',
                borderRadius: 0,
              }}
            >
              Все заявки
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/boards"
              sx={{
                fontSize: '1rem',
                borderBottom: isBoardsPage ? '1px solid white' : 'none',
                borderRadius: 0,
              }}
            >
              Проекты
            </Button>
          </Box>

          {/* Правая часть: Создать заявку */}
          <Box sx={{ marginRight: 2 }}>
            <Button
              onClick={handleOpenTaskForm}
              sx={{
                backgroundColor: '#00A8FF',
                color: 'white',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#0090e5',
                },
              }}
            >
              Создать заявку
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <CreateTaskForm open={openTaskForm} onClose={handleCloseTaskForm} />
    </>
  )
}

export default Header
