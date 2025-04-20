import { useNavigate } from 'react-router-dom'
import { useBoards } from '../api/boards'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'

const BoardsPage = () => {
  const navigate = useNavigate()
  const { data: boards, isLoading, error } = useBoards()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  console.log('Boards data:', boards)

  const handleViewBoard = (boardId: number) => {
    navigate(`/boards/${boardId}`)
  }

  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '80vh',
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
        {Array.isArray(boards) && boards.length > 0 ? (
          boards.map((board) => (
            <Card
              key={board.id}
              sx={{
                mb: 2,
                boxShadow: 'none',
                border: '2px solid #4ba7f6',
              }}
            >
              <CardContent>
                <Typography variant="h5">{board.name}</Typography>
                <Typography variant="body2">{board.description}</Typography>
                <Typography variant="body2">Tasks: {board.taskCount}</Typography>
                <Button
                  onClick={() => handleViewBoard(board.id)}
                  variant="outlined"
                  sx={{ mt: 1, fontWeight: 750 }}
                >
                  Посмотреть Доску
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>Нет доступных досок</Typography>
        )}
      </Box>
    </Box>
  )
}

export default BoardsPage