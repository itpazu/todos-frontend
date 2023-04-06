import React, { useRef, Dispatch, SetStateAction } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Todo as TodoProp } from '../context/globalContext';

const MOCK = [
    {
        "id": 1,
        "title": "hello world",
        "description": "first item to add",
        "created_at": "2023-04-04T23:14:02.830843+03:00",
        "completed": false,
        "user": "itpazu",
        "updated_at": "2023-04-04T23:14:02.830903+03:00"
    },
    {
        "id": 2,
        "title": "hello",
        "description": "goodby",
        "created_at": "2023-04-04T23:29:41.152817+03:00",
        "completed": false,
        "user": "itpazu",
        "updated_at": "2023-04-04T23:29:41.152843+03:00"
    },
    {
        "id": 3,
        "title": "first todo",
        "description": "last todo",
        "created_at": "2023-04-04T23:36:19.550944+03:00",
        "completed": false,
        "user": "itpazu",
        "updated_at": "2023-04-04T23:36:19.550983+03:00"
    }
]

const MOCK2 = [
    {
        "id": 1,
        "title": "I am a completed item",
        "description": "first item to add",
        "created_at": "2023-04-04T23:14:02.830843+03:00",
        "completed": false,
        "user": "itpazu",
        "updated_at": "2023-04-04T23:14:02.830903+03:00"
    },
    {
        "id": 2,
        "title": "me too",
        "description": "goodby",
        "created_at": "2023-04-04T23:29:41.152817+03:00",
        "completed": false,
        "user": "itpazu",
        "updated_at": "2023-04-04T23:29:41.152843+03:00"
    },
    {
        "id": 3,
        "title": "well im completed number 3",
        "description": "last todo",
        "created_at": "2023-04-04T23:36:19.550944+03:00",
        "completed": false,
        "user": "itpazu",
        "updated_at": "2023-04-04T23:36:19.550983+03:00"
    }
]
export default function TodoList({ todos, setTodos, setcompletedTodos }: {
    todos: TodoProp[],
    setTodos: Dispatch<SetStateAction<TodoProp[]>>,
    setcompletedTodos: Dispatch<SetStateAction<TodoProp[]>>
}) {

    let draggedItemIdx = useRef<number | null>(null)
    let draggedOver = useRef<number | null>(null)


    const handleDragEnd = (completed: boolean, idxSrc: number, idxTaraget: number) => {

        if (completed) {

            setcompletedTodos((prevTodos) => {
                let todos = [...prevTodos]
                let removed = todos.splice(idxSrc, 1)
                todos.splice(idxTaraget, 0, removed[0])
                return todos
            })
        }
        else {
            setTodos((prevTodos) => {
                let todos = [...prevTodos]
                let removed = todos.splice(idxSrc, 1)
                todos.splice(idxTaraget, 0, removed[0])
                return todos
            })
        }
    }

    return (

        <>
            {todos.map(({ title, description, completed }, idx) => {
                return (
                    <Accordion
                        id="this"
                        key={`${title}`}
                        draggable
                        onDragStart={(e) => {
                            draggedItemIdx.current = idx
                            e.dataTransfer.setData("text/plain", JSON.stringify(idx));
                            e.dataTransfer.setData("completed", JSON.stringify(completed));
                            e.dataTransfer.effectAllowed = "move";

                        }}
                        onDragEnter={(e) => {
                            draggedOver.current = idx
                        }}
                        onDragEnd={() => handleDragEnd(completed, draggedItemIdx.current as number, draggedOver.current as number)}
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
