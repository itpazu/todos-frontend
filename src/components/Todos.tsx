import React, { useMemo } from 'react';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TodoList from './TodoList';
import AddToDo from './AddToDo';
import SubmitChanges from './SubmitChanges';
import { TodosFromProps, MovToDoesHandler, Todo, useGlobalContext } from '../context/globalContext';

export default function Todos({ data, isLoading = false }:
    {
        data: TodosFromProps
        isLoading?: boolean
    }
) {
    const { dispatch, state } = useGlobalContext()
    const { todos, completedTodos } = state;

    // cache of the original state - completed / pending per todo in the database
    const originalState = useMemo(() => {
        return [...data.todos, ...data.completedTodos].reduce<Map<number, boolean>>((prevMap, current) => {
            return prevMap.set(current.id, current.completed)
        }, new Map)
    }, [data])
    // cache the original order of todos
    const originaOrderTodos = useMemo(() => data?.todos.map(({ id }) => id), [data])
    const originaOrderCompletedTodos = useMemo(() => data?.completedTodos.map(({ id }) => id), [data])
    // evaluates the difference between original order of todos and the current order
    // returns a boolean to enable submit button if todos order changed
    const evaluateCurrentOrder = (originalOrder: number[] = [], curentOrder: Todo[] = []) => {
        return originalOrder.some((val, idx) => !(val === curentOrder[idx]?.id))
    }
    const areTodosReordered = () => {
        const reorderedTodos = evaluateCurrentOrder(originaOrderTodos, todos)
        const reorderedCompletedTodos = evaluateCurrentOrder(originaOrderCompletedTodos, completedTodos)
        return reorderedTodos || reorderedCompletedTodos

    }

    const updateStatusIfChanged = (id: number, newStatus: boolean) => {
        let Dispatchpayload;
        if ((originalState.get(id) === newStatus)) {
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
            <Grid container minHeight={'15vh'} justifyContent="space-between" alignItems={"center"}
                sx={theme => ({ position: 'sticky', top: 0, background: theme.palette.primary.main, zIndex: theme.zIndex.drawer + 1 })}

            >
                <Grid
                    item
                    md={4}
                    xs={12}
                >
                    <SubmitChanges
                        areReordered={areTodosReordered()}
                    />
                </Grid>
                <Grid item
                    md={8}
                    xs={12}
                >
                    <AddToDo />

                </Grid>

            </Grid>
            <Grid item container spacing={2}
                xs={12} minHeight={{ xs: "40vh", md: '50vh' }}>


                <Grid
                    item
                    md={4}
                    xs={12}
                    onDrop={completedTodosDropHandler}
                    onDragOver={dragStartHandler}
                >
                    <Paper sx={{ height: '100%', padding: 2, backgroundColor: "#aed581" }}>
                        <Stack justifyContent={'center'} direction={"row"} marginBottom={"10px"}>
                            <Typography variant="h6"> DID </Typography>
                        </Stack>
                        <Stack spacing={0.5}>
                            {isLoading ?

                                new Array(3).fill(0).map((_, idx) => <Skeleton
                                    key={idx}
                                    variant='rectangular'
                                    sx={{ bgcolor: "#e0e0e0" }}
                                    height={70}
                                    animation="wave"
                                />)

                                :
                                <TodoList todos={completedTodos} moveToDoes={moveTodoHandler} />
                            }
                        </Stack>

                    </Paper>
                </Grid>
                <Grid
                    item
                    md={8}
                    xs={12}
                    onDrop={todosDropHandler}
                    onDragOver={dragStartHandler}
                    justifyContent="center" >
                    <Paper id="source" sx={{ height: '100%', padding: 2, backgroundColor: "#e57373" }} >
                        <Stack justifyContent={'center'} direction={"row"} marginBottom={"10px"}>
                            <Typography variant="h6"> DO </Typography>
                        </Stack>

                        <Stack spacing={0.5}>
                            {isLoading ?

                                new Array(3).fill(0).map((_, idx) => <Skeleton
                                    key={idx}
                                    variant='rectangular'
                                    sx={{ bgcolor: "#e0e0e0" }}
                                    height={70}
                                    animation="wave"
                                />)

                                :
                                <TodoList todos={todos} moveToDoes={moveTodoHandler} />
                            }
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

        </>


    )
}

