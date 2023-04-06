import React, { useRef, Dispatch, SetStateAction, DragEvent } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Todo as TodoProp } from '../context/globalContext';

export default function TodoList({ todos, setTodos, setcompletedTodos }: {
    todos: TodoProp[],
    setTodos: Dispatch<SetStateAction<TodoProp[]>>,
    setcompletedTodos: Dispatch<SetStateAction<TodoProp[]>>
}) {

    let draggedItemIdx = useRef<number | null>(null)
    let draggedOver = useRef<number | null>(null)


    const handleDragEnd = (completed: boolean) => {
        let setFunction = setTodos
        if (completed) {
            setFunction = setcompletedTodos
        }
        setFunction((prevTodos) => {
            let todos = [...prevTodos]
            let removed = todos.splice(draggedItemIdx.current as number, 1)
            todos.splice(draggedOver.current as number, 0, removed[0])
            return todos
        })
    }


    const dragStartHandler = (e: DragEvent, idx: number, completed: boolean) => {
        draggedItemIdx.current = idx
        e.dataTransfer.setData("text/plain", JSON.stringify(idx));
        e.dataTransfer.setData("completed", JSON.stringify(completed));
        e.dataTransfer.effectAllowed = "move";

    }
    return (

        <>
            {todos.map(({ title, description, completed }, idx) => {
                return (
                    <Accordion
                        id="this"
                        key={`${title}`}
                        draggable
                        onDragStart={(e) => dragStartHandler(e, idx, completed)}
                        onDragEnter={() => draggedOver.current = idx}
                        onDragEnd={() => handleDragEnd(completed)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>{title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {description}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                )
            })}

        </>


    );
}
