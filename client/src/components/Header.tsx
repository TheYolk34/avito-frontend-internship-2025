import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import CreateTaskForm from './CreateTaskForm';

const Header = () => {
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const queryClient = useQueryClient();
  const location = useLocation();

  const handleOpenTaskForm = () => {
    setOpenTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setOpenTaskForm(false);
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const isBoardsPage = location.pathname.startsWith('/boards') || location.pathname.startsWith('/board');
  const isTasksPage = location.pathname === '/tasks';

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#000',
          boxShadow: 'none',
          height: '80px',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 4, marginLeft: 10 }}>
            <Button
              color="inherit"
              component={Link}
              to="/tasks"
              sx={{
                fontSize: '1.40rem',
                borderBottom: isTasksPage ? '2px solid white' : 'none',
                borderRadius: 0,
                textTransform: 'none',
                '&:hover': {
                  color: '#f71b47',
                },
              }}
            >
              Все Задачи
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/boards"
              sx={{
                fontSize: '1.40rem',
                borderBottom: isBoardsPage ? '2px solid white' : 'none',
                borderRadius: 0,
                textTransform: 'none',
                '&:hover': {
                  color: '#f71b47',
                },
              }}
            >
              Проекты
            </Button>
          </Box>
          <Box sx={{ marginRight: 10 }}>
            <Button
              onClick={handleOpenTaskForm}
              sx={{
                backgroundColor: '#00A8FF',
                color: 'white',
                borderRadius: '20px',
                padding: '8px 20px',
                fontSize: '1.40rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#0090e5',
                },
              }}
            >
              Создать задачу
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ height: '80px' }} />
      <CreateTaskForm open={openTaskForm} onClose={handleCloseTaskForm} />
    </>
  );
};

export default Header;