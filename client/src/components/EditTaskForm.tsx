import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Autocomplete, ToggleButton, Button, Modal, Box, Typography } from '@mui/material';
import { useUpdateTask, Task, User, useUsers } from '../api/tasks';
import { useBoards } from '../api/boards';
import { RootState } from '../store';
import { updateForm, resetForm } from '../store/taskFormSlice';

interface EditTaskFormProps {
  open: boolean;
  onClose: () => void;
  task: Task;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ open, onClose, task }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formState = useSelector((state: RootState) => state.taskForm);
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: formState,
  });

  const updateTaskMutation = useUpdateTask();
  const { data: boards } = useBoards();
  const { data: users } = useUsers();

  const selectedStatus = watch('status');
  const selectedPriority = watch('priority');

  useEffect(() => {
    dispatch(
      updateForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee.fullName,
        boardId: task.boardId,
      })
    );
    setValue('title', task.title);
    setValue('description', task.description);
    setValue('status', task.status);
    setValue('priority', task.priority);
    setValue('assignee', task.assignee.fullName);
    setValue('boardId', task.boardId);
  }, [task, dispatch, setValue]);

  const onSubmit = (data: any) => {
    const selectedUser = users?.find((user: User) => user.fullName === data.assignee) || {
      id: 0,
      fullName: data.assignee,
      email: '',
      avatarUrl: '',
    };
    const taskData = {
      ...data,
      assignee: selectedUser,
    };

    updateTaskMutation.mutate(
      { ...taskData, id: task.id },
      {
        onSuccess: () => {
          dispatch(resetForm());
          onClose();
        },
      }
    );
  };

  const goToBoard = () => {
    navigate(`/boards/${task.boardId}`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 24,
        }}
      >
        <Typography variant="h5" sx={{ mb: 0, fontWeight: 'bold' }}>
          Редактировать Задачу
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                label="Название"
                fullWidth
                margin="normal"
                variant="outlined"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(updateForm({ title: e.target.value }));
                }}
                sx={{ mb: 1 }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                label="Описание"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                variant="outlined"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(updateForm({ description: e.target.value }));
                }}
                sx={{ mb: 1 }}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Статус
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <ToggleButton
                    value="Backlog"
                    selected={selectedStatus === 'Backlog'}
                    onChange={() => {
                      const newValue = selectedStatus === 'Backlog' ? '' : 'Backlog';
                      field.onChange(newValue);
                      dispatch(updateForm({ status: newValue }));
                    }}
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      border: '1px solid #66dd70',
                      borderRadius: '8px !important',
                      '&.Mui-selected': {
                        backgroundColor: '#66dd70',
                        color: 'white',
                        '&:hover': { backgroundColor: '#55cc60' },
                      },
                      '&:hover': { backgroundColor: '#66dd7020' },
                    }}
                  >
                    To Do
                  </ToggleButton>
                  <ToggleButton
                    value="InProgress"
                    selected={selectedStatus === 'InProgress'}
                    onChange={() => {
                      const newValue = selectedStatus === 'InProgress' ? '' : 'InProgress';
                      field.onChange(newValue);
                      dispatch(updateForm({ status: newValue }));
                    }}
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      border: '1px solid #8e60e1',
                      borderRadius: '8px !important',
                      '&.Mui-selected': {
                        backgroundColor: '#8e60e1',
                        color: 'white',
                        '&:hover': { backgroundColor: '#7d50d1' },
                      },
                      '&:hover': { backgroundColor: '#8e60e120' },
                    }}
                  >
                    In Progress
                  </ToggleButton>
                  <ToggleButton
                    value="Done"
                    selected={selectedStatus === 'Done'}
                    onChange={() => {
                      const newValue = selectedStatus === 'Done' ? '' : 'Done';
                      field.onChange(newValue);
                      dispatch(updateForm({ status: newValue }));
                    }}
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      border: '1px solid #ea5058',
                      borderRadius: '8px !important',
                      '&.Mui-selected': {
                        backgroundColor: '#ea5058',
                        color: 'white',
                        '&:hover': { backgroundColor: '#da4048' },
                      },
                      '&:hover': { backgroundColor: '#ea505820' },
                    }}
                  >
                    Done
                  </ToggleButton>
                </Box>
              </Box>
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Приоритет
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <ToggleButton
                    value="Low"
                    selected={selectedPriority === 'Low'}
                    onChange={() => {
                      const newValue = selectedPriority === 'Low' ? '' : 'Low';
                      field.onChange(newValue);
                      dispatch(updateForm({ priority: newValue }));
                    }}
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      border: '1px solid #66dd70',
                      borderRadius: '8px !important',
                      '&.Mui-selected': {
                        backgroundColor: '#66dd70',
                        color: 'white',
                        '&:hover': { backgroundColor: '#55cc60' },
                      },
                      '&:hover': { backgroundColor: '#66dd7020' },
                    }}
                  >
                    Низкий
                  </ToggleButton>
                  <ToggleButton
                    value="Medium"
                    selected={selectedPriority === 'Medium'}
                    onChange={() => {
                      const newValue = selectedPriority === 'Medium' ? '' : 'Medium';
                      field.onChange(newValue);
                      dispatch(updateForm({ priority: newValue }));
                    }}
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      border: '1px solid #8e60e1',
                      borderRadius: '8px !important',
                      '&.Mui-selected': {
                        backgroundColor: '#8e60e1',
                        color: 'white',
                        '&:hover': { backgroundColor: '#7d50d1' },
                      },
                      '&:hover': { backgroundColor: '#8e60e120' },
                    }}
                  >
                    Средний
                  </ToggleButton>
                  <ToggleButton
                    value="High"
                    selected={selectedPriority === 'High'}
                    onChange={() => {
                      const newValue = selectedPriority === 'High' ? '' : 'High';
                      field.onChange(newValue);
                      dispatch(updateForm({ priority: newValue }));
                    }}
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      border: '1px solid #ea5058',
                      borderRadius: '8px !important',
                      '&.Mui-selected': {
                        backgroundColor: '#ea5058',
                        color: 'white',
                        '&:hover': { backgroundColor: '#da4048' },
                      },
                      '&:hover': { backgroundColor: '#ea505820' },
                    }}
                  >
                    Высокий
                  </ToggleButton>
                </Box>
              </Box>
            )}
          />
          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={users || []}
                getOptionLabel={(option: User) => option.fullName || ''}
                onChange={(e, value) => {
                  const assigneeName = value?.fullName || '';
                  field.onChange(assigneeName);
                  dispatch(updateForm({ assignee: assigneeName }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Исполнитель"
                    variant="outlined"
                    margin="normal"
                    sx={{ mb: 1 }}
                  />
                )}
                sx={{ mb: 1 }}
                value={users?.find((user: User) => user.fullName === formState.assignee) || null}
              />
            )}
          />
          <Controller
            name="boardId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={boards || []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(e, value) => {
                  const boardId = value?.id || undefined;
                  field.onChange(boardId);
                  dispatch(updateForm({ boardId }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Board"
                    variant="outlined"
                    margin="normal"
                    sx={{ mb: 1 }}
                  />
                )}
                sx={{ mb: 1 }}
                value={boards?.find((board) => board.id === formState.boardId) || null}
              />
            )}
          />
          <Box sx={{ mt: 1, display: 'flex', gap: 26, justifyContent: 'flex-start' }}>
            <Button type="submit" variant="contained" sx={{ borderRadius: '8px', px: 4 }}>
              Обновить
            </Button>
            <Button onClick={goToBoard} variant="outlined" sx={{ width: 200, borderRadius: '8px' }}>
              Перейти к доске
            </Button>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
              Отменить
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditTaskForm;