import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State, Todo, DispatchPayload, TodoChanges } from '../context/globalContext'

const initialState: Pick<State, "completedTodos" | "todos"> = {
    todos: [],
    completedTodos: [],
}
export type ToggleCompleteAction = PayloadAction<{
    moveFrom: TodosListName,
    moveTo: TodosListName,
    idx: number,
    id: number,
    originalStatus: boolean | undefined,
    completed: boolean
}>

export type editTodoInput = Pick<Todo, 'title' | 'description'>
type TodosListName = "todos" | "completedTodos"
const todosSlice = createSlice(
    {
        name: "todos",
        initialState,
        reducers: {
            todos: (state, action: PayloadAction<{
                completedTodos?: Todo[]
                todos?: Todo[]
            }>) => {
                const { payload: { todos = [], completedTodos = [] } } = action
                state.todos = todos
                state.completedTodos = completedTodos
            },
            reorderTodos: (state, action: PayloadAction<{
                todosList: TodosListName
                fromPosition: number
                toPosition: number
            }>) => {
                const { payload: {
                    todosList,
                    fromPosition,
                    toPosition
                } } = action
                const reorderedTodo = state[todosList].splice(fromPosition, 1)[0]
                state[todosList].splice(toPosition, 0, reorderedTodo)
            },
            newTodo: (state, action: PayloadAction<{
                newItem: Todo, fieldsUpdates: Omit<Todo, 'id'>, id: number

            }>) => {
                state.todos.push(action.payload.newItem)
            },
            editTodo: (state, action: PayloadAction<{
                todosList: TodosListName,
                id: number,
                input: editTodoInput
            }>) => {
                const { todosList, id, input } = action.payload;
                const todoToUpdate = state[todosList].find(todo => todo.id === id)
                if (todoToUpdate) {
                    todoToUpdate.title = input.title
                    todoToUpdate.description = input.description
                }
            },
            toggleComplete: (state, { payload: { moveFrom, moveTo, idx } }: ToggleCompleteAction) => {

                const item = state[moveFrom].splice(idx, 1)[0]
                item.completed = !item?.completed
                state[moveTo].splice(0, 0, item)


            },
            deleteTodo: (state, { payload: { todoList, idx } }: PayloadAction<{
                todoList: TodosListName,
                idx: number
                id: number
            }>) => {

                state[todoList].splice(idx, 1)

            },

        }
    }
)
export const { newTodo, editTodo, toggleComplete, todos, deleteTodo, reorderTodos } = todosSlice.actions
export default todosSlice.reducer