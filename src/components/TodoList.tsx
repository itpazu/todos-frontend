import React, { useRef, DragEvent, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Todo as TodoProp, MovToDoesHandler } from '../context/globalContext';
import TodoDetails from './TodoDetails';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'src/store/reduxHooks';
import { deleteTodo, reorderTodos } from 'src/store/todosSlice';

export default function TodoList({ todos, moveToDoes }: {
    todos: TodoProp[],
    moveToDoes: MovToDoesHandler

}) {

    let draggedItemIdx = useRef<number | null>(null)
    let draggedOver = useRef<number | null>(null)

    const [showTitle, setShowTitle] = useState(true)
    const state = useAppSelector(state => state.todos)
    const reduxDispatch = useAppDispatch()
    const handleDragEnd = (completed: boolean) => {
        reduxDispatch(reorderTodos({
            todosList: completed ? "completedTodos" : "todos",
            fromPosition: draggedItemIdx.current as number,
            toPosition: draggedOver.current as number
        }))

    }


    const dragStartHandler = (e: DragEvent, idx: number, completed: boolean) => {
        draggedItemIdx.current = idx
        e.dataTransfer.setData("text/plain", JSON.stringify(idx));
        e.dataTransfer.setData("completed", JSON.stringify(completed));
        e.dataTransfer.effectAllowed = "move";

    }

    const handleMove = (completed: boolean, idx: number) => {
        const moveFromArr = completed ? "completedTodos" : "todos"
        const moveToArr = completed ? "todos" : "completedTodos"
        moveToDoes(moveFromArr, moveToArr, idx)

    }



    const handleDelete = (completed: boolean, idx: number, id: number) => {
        reduxDispatch(
            deleteTodo({ todoList: completed ? "completedTodos" : "todos", id, idx }))

    }
    return (

        <>
            {todos.map((todo, idx) => {
                const { title, completed, id } = todo
                return (
                    <Accordion
                        TransitionProps={{ unmountOnExit: true }}
                        key={`${title + id}`}
                        draggable
                        onDragStart={(e) => dragStartHandler(e, idx, completed)}
                        onDragEnter={() => draggedOver.current = idx}
                        onDragEnd={() => handleDragEnd(completed)}
                        onChange={(e) => setShowTitle(!showTitle)}
                        sx={{ backgroundColor: theme => theme.palette.common.whiteTone }}

                    >

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="todo description"

                        >
                            <Stack width={"100%"} direction="row"
                                justifyContent={"space-between"}
                            >
                                <Stack direction="row" spacing={2}>

                                    <Checkbox
                                        color="success"
                                        onChange={() => handleMove(completed, idx)}
                                        checked={completed}

                                    />

                                    <Typography variant="h6">{title}</Typography>
                                </Stack>

                                <Button

                                    variant="text" color="error"
                                    onClick={() => handleDelete(completed, idx, id)}>delete</Button>


                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ height: '100%' }}>
                            <TodoDetails todo={todo} idx={idx} />
                        </AccordionDetails>
                    </Accordion >
                )
            })}

        </>


    );
}
