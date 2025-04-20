import { http, HttpResponse } from 'msw'

   export const handlers = [
     http.get('http://localhost:8080/api/v1/boards', () => {
       return HttpResponse.json([
         { id: '1', title: 'Test Board' }
       ], { status: 200 })
     }),
     http.post('http://localhost:8080/api/v1/tasks', () => {
       return HttpResponse.json(
         { id: '1', title: 'Test Task', description: '', status: 'TODO', priority: 'LOW', assignee: '', boardId: '1' },
         { status: 201 }
       )
     }),
     http.get('http://localhost:8080/api/v1/users', () => {
       return HttpResponse.json([
         { id: '1', name: 'User1' },
         { id: '2', name: 'User2' }
       ], { status: 200 })
     }),
     http.get('http://localhost:8080/api/v1/tasks', () => {
       return HttpResponse.json([
         { id: '1', title: 'Test Task', description: 'Test', status: 'TODO', priority: 'LOW', assignee: 'User1', boardId: '1' },
         { id: '2', title: 'Another Task', description: 'Test 2', status: 'DONE', priority: 'HIGH', assignee: 'User2', boardId: '1' }
       ], { status: 200 })
     }),
   ]