import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State, Todo, } from '../context/globalContext'
import {
    toggleComplete, ToggleCompleteAction,
    editTodoInput, newTodo, editTodo, todos, deleteTodo
} from './todosSlice';

const initialState: Pick<State, "fieldsUpdates"> = {

    fieldsUpdates: {},
}

// type editTodoInput = Pick<Todo, 'title' | 'description'>
// type TodosListName = "todos" | "completedTodos"
const fieldUpdatesSlice = createSlice(
    {
        name: "fieldUpdates",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(toggleComplete, (state, { payload: { id, originalStatus, completed } }: ToggleCompleteAction) => {
                const item = state.fieldsUpdates[id] ?? { id, completed }
                console.log(originalStatus, completed)
                if (originalStatus === completed) {
                    delete item.completed
                    if (Object.keys(item).length === 1) {
                        delete state.fieldsUpdates[id]
                        return
                    }

                } else {
                    item.completed = completed
                    item.id = id
                }
                state.fieldsUpdates[id] = item


            })
            builder.addCase(newTodo, (state, action: PayloadAction<{
                newItem: Todo, fieldsUpdates: Omit<Todo, 'id'>, id: number

            }>) => {
                state.fieldsUpdates[action.payload.id] = action.payload.fieldsUpdates
            }
            )
            builder.addCase(editTodo, (state, action: PayloadAction<{
                id: number,
                input: editTodoInput
            }>) => {
                const { id, input } = action.payload;
                const todoToUpdate = state.fieldsUpdates[id] ?? {}
                state.fieldsUpdates[id] = { id, ...todoToUpdate, ...input }
            },
            )
            builder.addCase(deleteTodo, (state, { payload: { id } }: PayloadAction<{
                id: number
            }>) => {
                if (id > 0) {
                    state.fieldsUpdates[id] = { id, description: 'delete' }
                    return

                }
                delete state.fieldsUpdates[id]
            })

            builder.addCase(todos, (state, _) => {

                state.fieldsUpdates = {}
            },
            )
        }
    }
)
// export const { newTodo, editTodo, toggleComplete } = todosSlice.actions
export default fieldUpdatesSlice.reducer
