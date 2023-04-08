import React, { useRef, DragEvent, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Todo as TodoProp, useGlobalContext, MovToDoesHandler } from '../context/globalContext';
import TodoDetails from './TodoDetails';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack'

export default function TodoList({ todos, moveToDoes }: {
    todos: TodoProp[],
    moveToDoes: MovToDoesHandler

}) {

    let draggedItemIdx = useRef<number | null>(null)
    let draggedOver = useRef<number | null>(null)

    const [showTitle, setShowTitle] = useState(true)
    const { state, dispatch } = useGlobalContext()

    const handleDragEnd = (completed: boolean) => {
        let todosCopy;
        let todosType;
        if (completed) {
            todosCopy = [...state.completedTodos]
            todosType = "completedTodos"
        } else {
            todosCopy = [...state.todos]
            todosType = "todos"
        }
        let removed = todosCopy.splice(draggedItemIdx.current as number, 1)
        todosCopy.splice(draggedOver.current as number, 0, removed[0])
        dispatch({ type: todosType, payload: { todos: todosCopy } })
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

                    >

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="todo description"


                        >
                            <Stack direction="row" spacing={2}>
                                <Checkbox
                                    color="success"
                                    onChange={() => handleMove(completed, idx)}
                                    checked={completed}

                                />

                                <Typography variant="h6">{title}</Typography>

                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ height: '100%' }}>
                            <TodoDetails todo={todo} idx={idx} />
                        </AccordionDetails>
                    </Accordion>
                )
            })}

        </>


    );
}
