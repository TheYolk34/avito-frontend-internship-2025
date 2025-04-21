import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { loadPersistedForm } from './store/taskFormSlice';
import App from './App';
import './index.css'; 

// Component to load persisted state on app startup
const AppWrapper: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPersistedForm());
  }, [dispatch]);

  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>
);