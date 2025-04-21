import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useBoards, Board } from '../api/boards';
import { useUpdateTask, Task, useTasks  } from '../api/tasks';
import { Card, CardContent, Typography, Box } from '@mui/material';
import EditTaskForm from '../components/EditTaskForm';

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { state } = useLocation();
  const queryClient = useQueryClient();
  const { data: boards, isLoading: boardsLoading, error: boardsError } = useBoards();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks();
  const updateTaskMutation = useUpdateTask();

  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [boardTasks, setBoardTasks] = useState<Task[]>([]);

  const board = boards?.find((b: Board) => b.id === parseInt(boardId || '0'));

  // Initialize boardTasks when tasks data is loaded
  useEffect(() => {
    if (tasks) {
      const filteredTasks = tasks.filter((task: Task) => task.boardId === parseInt(boardId || '0')) || [];
      setBoardTasks(filteredTasks);
    }
  }, [tasks, boardId]);

  // Handle opening a task from the URL state
  useEffect(() => {
    if (state?.openTaskId && boardTasks.length) {
      const taskToOpen = boardTasks.find((task: Task) => task.id === state.openTaskId);
      if (taskToOpen) {
        setOpenTask(taskToOpen);
      }
    }
  }, [state, boardTasks]);

  if (boardsLoading || tasksLoading) return <div>Loading...</div>;
  if (boardsError) return <div>Error: {(boardsError as Error).message}</div>;
  if (tasksError) return <div>Error: {(tasksError as Error).message}</div>;

  const handleTaskClick = (task: Task) => {
    setOpenTask(task);
  };

  const handleClose = () => {
    setOpenTask(null);
    queryClient.invalidateQueries({ queryKey: ['tasks', parseInt(boardId || '0')] });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If no destination (dropped outside a droppable area), do nothing
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Determine the new status based on the destination column
    const newStatus = destination.droppableId as 'Backlog' | 'InProgress' | 'Done';

    // Update the local state
    const updatedTasks = [...boardTasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: newStatus };
    updatedTasks.splice(destination.index, 0, updatedTask);
    setBoardTasks(updatedTasks);

    // Update the task's status in the backend
    updateTaskMutation.mutate(
      { ...updatedTask, id: movedTask.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tasks', parseInt(boardId || '0')] });
        },
      }
    );
  };

  const toDoTasks = boardTasks?.filter((task: Task) => task.status === 'Backlog') || [];
  const inProgressTasks = boardTasks?.filter((task: Task) => task.status === 'InProgress') || [];
  const doneTasks = boardTasks?.filter((task: Task) => task.status === 'Done') || [];

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'Высокий';
      case 'Medium':
        return 'Средний';
      case 'Low':
        return 'Низкий';
      default:
        return 'Не указан';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#ea5058';
      case 'Medium':
        return '#8e60e1';
      case 'Low':
        return '#66dd70';
      default:
        return 'text.secondary';
    }
  };

  return (
    <Box sx={{ p: 6, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">{board ? board.name : 'Board'}</Typography>
      <Typography variant="body2" sx={{ mb: 4 }}>{board?.description}</Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 0 }}>
          <Droppable droppableId="Backlog">
            {(provided) => (
              <Box
                sx={{ flex: 1, border: '3px solid #000', p: 2, minHeight: '70vh' }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  To do
                </Typography>
                {toDoTasks.length ? (
                  toDoTasks.map((task: Task, index: number) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleTaskClick(task)}
                          onKeyDown={(e) => e.key === 'Enter' && handleTaskClick(task)}
                          role="button"
                          tabIndex={0}
                        >
                          <Card
                            sx={{
                              mb: 2,
                              boxShadow: 'none',
                              border: '2px solid',
                              borderColor:
                                task.priority === 'High'
                                  ? '#ea5058'
                                  : task.priority === 'Medium'
                                  ? '#8e60e1'
                                  : '#66dd70',
                              borderRadius: '22px',
                              cursor: 'pointer',
                              maxWidth: '80%',
                              mx: 'auto',
                            }}
                          >
                            <CardContent sx={{ p: 1 }}>
                              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                {task.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ textAlign: 'center', color: 'text.secondary' }}
                              >
                                Приоритет:{' '}
                                <span style={{ color: getPriorityColor(task.priority) }}>
                                  {getPriorityLabel(task.priority)}
                                </span>
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center' }}>Нет задач</Typography>
                )}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>

          <Droppable droppableId="InProgress">
            {(provided) => (
              <Box
                sx={{ flex: 1, border: '3px solid #000', borderLeft: 'none', p: 2, minHeight: '70vh' }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  In progress
                </Typography>
                {inProgressTasks.length ? (
                  inProgressTasks.map((task: Task, index: number) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleTaskClick(task)}
                          onKeyDown={(e) => e.key === 'Enter' && handleTaskClick(task)}
                          role="button"
                          tabIndex={0}
                        >
                          <Card
                            sx={{
                              mb: 2,
                              boxShadow: 'none',
                              border: '2px solid',
                              borderColor:
                                task.priority === 'High'
                                  ? '#ea5058'
                                  : task.priority === 'Medium'
                                  ? '#8e60e1'
                                  : '#66dd70',
                              borderRadius: '22px',
                              cursor: 'pointer',
                              maxWidth: '80%',
                              mx: 'auto',
                            }}
                          >
                            <CardContent sx={{ p: 1 }}>
                              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                {task.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ textAlign: 'center', color: 'text.secondary' }}
                              >
                                Приоритет:{' '}
                                <span style={{ color: getPriorityColor(task.priority) }}>
                                  {getPriorityLabel(task.priority)}
                                </span>
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center' }}>Нет задач</Typography>
                )}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>

          <Droppable droppableId="Done">
            {(provided) => (
              <Box
                sx={{ flex: 1, border: '3px solid #000', borderLeft: 'none', p: 2, minHeight: '70vh' }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  Done
                </Typography>
                {doneTasks.length ? (
                  doneTasks.map((task: Task, index: number) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleTaskClick(task)}
                          onKeyDown={(e) => e.key === 'Enter' && handleTaskClick(task)}
                          role="button"
                          tabIndex={0}
                        >
                          <Card
                            sx={{
                              mb: 2,
                              boxShadow: 'none',
                              border: '2px solid',
                              borderColor:
                                task.priority === 'High'
                                  ? '#ea5058'
                                  : task.priority === 'Medium'
                                  ? '#8e60e1'
                                  : '#66dd70',
                              borderRadius: '22px',
                              cursor: 'pointer',
                              maxWidth: '80%',
                              mx: 'auto',
                            }}
                          >
                            <CardContent sx={{ p: 1 }}>
                              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                {task.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ textAlign: 'center', color: 'text.secondary' }}
                              >
                                Приоритет:{' '}
                                <span style={{ color: getPriorityColor(task.priority) }}>
                                  {getPriorityLabel(task.priority)}
                                </span>
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center' }}>Нет задач</Typography>
                )}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Box>
      </DragDropContext>

      {openTask && <EditTaskForm open={!!openTask} onClose={handleClose} task={openTask} />}
    </Box>
  );
};

export default BoardPage;