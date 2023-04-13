import React, { useState, useMemo, useEffect } from 'react';
import { Paper, Grid } from '@mui/material';
import { useGlobalContext, MovToDoesHandler, Todo } from '../context/globalContext';
import TodoList from './TodoList';
import AddToDo from './AddToDo';
import SubmitChanges from './SubmitChanges';
import useFetchTodos from './hooks/useTodos';

//implement submit all changes - note that new items may be in more then one place
// present local changes on screen
//login 

export default function Todos() {
    const { dispatch, state } = useGlobalContext()
    const { todos, completedTodos } = state;

    // cache of the original state - completed / pending per todo in the database
    const originalState = () => {
        return [...todos, ...completedTodos].reduce<Map<number, boolean>>((prevMap, current) => {
            return prevMap.set(current.id, current.completed)
        }, new Map)
    }
    // cache the original order of todos
    const originaOrderTodos = () => todos.map(({ id }) => id)
    const originaOrderCompletedTodos = () => completedTodos.map(({ id }) => id)

    // evaluates the difference between original order of todos and the current order
    // returns a boolean to enable submit button if todos order changed


    const evaluateCurrentOrder = (originalOrder: number[], curentOrder: Todo[]) => {
        return originalOrder.some((val, idx) => !(val === curentOrder[idx]?.id))
    }
    const areTodosReordered = () => {
        const reorderedTodos = evaluateCurrentOrder(originaOrderTodos(), todos)
        const reorderedCompletedTodos = evaluateCurrentOrder(originaOrderCompletedTodos(), completedTodos)
        return reorderedTodos || reorderedCompletedTodos

    }

    const updateStatusIfChanged = (id: number, newStatus: boolean) => {
        let Dispatchpayload;
        if ((originalState().get(id) === newStatus)) {
            Dispatchpayload = {
                type: "removeStatusChange", payload: {
                    id
                }
            }
        } else {
            Dispatchpayload = {
                type: "statusChanges",
                payload: {
                    id,
                    fieldsUpdates: {
                        [id]: {
                            id,
                            completed: newStatus,
                        }

                    }
                }

            }
        }
        dispatch(Dispatchpayload)
    }
    const moveTodoHandler: MovToDoesHandler = (moveFromArr, moveToArr, idx) => {
        const constTodoToEdit = { ...state[moveFromArr][idx] }
        constTodoToEdit.completed = !constTodoToEdit.completed
        const { completed, id } = constTodoToEdit;
        updateStatusIfChanged(id, completed)
        let moveFromArrCopy = [...state[moveFromArr]]
        moveFromArrCopy.splice(idx, 1)

        let moveToArrCopy = [...state[moveToArr]]
        moveToArrCopy.splice(0, 0, constTodoToEdit)

        return dispatch({
            type: "both", payload: {
                [moveToArr]: moveToArrCopy,
                [moveFromArr]: moveFromArrCopy
            }
        })
    }

    const todosDropHandler = (
        e: React.DragEvent<HTMLElement>
    ) => {
        //this line is necessary as Grid is a drop target, we want to avoid 
        //triggering the drop function when reordering inside the group
        if (e.dataTransfer.getData("completed") === "false") return
        let idx = parseInt(e.dataTransfer.getData("text"))
        moveTodoHandler("completedTodos", "todos", idx)

    }

    const completedTodosDropHandler = (
        e: React.DragEvent<HTMLElement>
    ) => {
        if (e.dataTransfer.getData("completed") === "true") return
        let idx = parseInt(e.dataTransfer.getData("text"))
        moveTodoHandler("todos", "completedTodos", idx)

    }

    const dragStartHandler = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    return (
        < >
            <Grid
                item
                md={3}
                xs={12}
                padding={3}
            >
                <SubmitChanges
                    areReordered={areTodosReordered()}
                />
            </Grid>
            <Grid item justifyContent={'center'}
                md={7}
                xs={12}>
                <AddToDo />
            </Grid>

            {completedTodos.length > 0 &&
                <Grid
                    item
                    md={3}
                    xs={12}
                    sx={{ minHeight: { xs: '40vh', md: '70vh' } }}
                    onDrop={completedTodosDropHandler}
                    onDragOver={dragStartHandler}
                >
                    <Paper sx={{ height: '100%', padding: 2, backgroundColor: "#aed581" }}>
                        <TodoList todos={completedTodos} moveToDoes={moveTodoHandler} />

                    </Paper>
                </Grid>}
            <Grid
                item
                md={completedTodos.length > 0 ? 7 : 10}
                xs={12}
                sx={{ minHeight: { xs: '40vh', md: '70vh' } }}
                onDrop={todosDropHandler}
                onDragOver={dragStartHandler}
                justifyContent="center" >
                <Paper id="source" sx={{ height: '100%', padding: 2, backgroundColor: "#e57373" }} >
                    <TodoList todos={todos} moveToDoes={moveTodoHandler} />
                </Paper>
            </Grid>

        </>


    )
}

