import React, { useState, useMemo } from 'react';
import { Paper, Grid, Box, Typography } from '@mui/material';
import { Todo as TodoProp } from '../context/globalContext';
import TodoList from './TodoList';
import SubmitChanges from './SubmitChanges';


export default function Todos({ fetchtedTodos, fetchedCompleted }: {
    fetchtedTodos: TodoProp[],
    fetchedCompleted: TodoProp[]

}) {

    const [todos, setTodos] = useState(fetchtedTodos)
    const [completedTodos, setcompletedTodos] = useState(fetchedCompleted)
    const [changes, setChanges] = useState<{ [index: number]: boolean }>({})

    // cache of the original state - completed / pending per todo in the database
    const originalState = useMemo(() => {
        return [...fetchtedTodos, ...fetchedCompleted].reduce<{ [index: number]: boolean }>((prev, current) => {
            return { ...prev, [current.id]: current.completed }
        }, {})
    }, [])

    // holds the value of the actual changed todos (from false to true and vice versa)
    const filterChanges = useMemo(() => {
        let entries = Object.entries(changes)
        let newEntries = entries.filter(([id, isCompleted]) => !(isCompleted === originalState[parseInt(id)]))
        return newEntries
    }, [changes])


    // handler for droping completed todo onto  pending and vice versa
    const todosDropHandler = (
        idx: number,
        movefromTodos: TodoProp[],
        removeFunction: React.Dispatch<React.SetStateAction<TodoProp[]>>,
        addToFunction: React.Dispatch<React.SetStateAction<TodoProp[]>>

    ) => {

        movefromTodos[idx].completed = !movefromTodos[idx].completed

        const { completed, id } = movefromTodos[idx];
        setChanges(prev => { return { ...prev, [id]: completed } })

        removeFunction(prev => {
            let localTodos = [...prev]
            localTodos.splice(idx, 1)
            return localTodos
        })

        addToFunction(prev => {
            let localCompleted = [...prev]
            localCompleted.splice(0, 0, movefromTodos[idx])
            return localCompleted
        })

    }

    const dragStartHandler = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }
    return (
        < >


            <SubmitChanges changes={filterChanges} />
            <Grid item justifyContent={'center'}
                md={7}
                xs={12}>
                hello
            </Grid>


            <Grid
                item
                md={3}
                xs={12}
                sx={{ minHeight: { xs: '40vh', md: '80vh' } }}
                onDrop={(e) => {
                    if (e.dataTransfer.getData("completed") === "true") return
                    let idx = parseInt(e.dataTransfer.getData("text"))
                    todosDropHandler(idx, todos, setTodos, setcompletedTodos)
                }}
                onDragOver={dragStartHandler}
            >
                <Paper sx={{ height: '100%', padding: 2 }}>
                    <TodoList todos={completedTodos} setTodos={setcompletedTodos} setcompletedTodos={setcompletedTodos} />

                </Paper>
            </Grid>
            <Grid
                item
                md={7}
                xs={12}
                sx={{ minHeight: { xs: '40vh', md: '80vh' } }}
                onDrop={(e) => {
                    //this line is necessary as Grid is a drop target, we want to avoid triggering the drop function when reordering inside the group
                    if (e.dataTransfer.getData("completed") === "false") return
                    let idx = parseInt(e.dataTransfer.getData("text"))
                    todosDropHandler(idx, completedTodos, setcompletedTodos, setTodos)
                }
                }
                onDragOver={dragStartHandler}
                justifyContent="center" >
                <Paper id="source" sx={{ height: '100%', padding: 2 }} >
                    <TodoList todos={todos} setTodos={setTodos} setcompletedTodos={setcompletedTodos} />
                </Paper>
            </Grid>

        </>


    )
}

