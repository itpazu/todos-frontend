
import { Todo } from '../../../src/context/globalContext';
import { NextApiResponse, NextApiRequest } from 'next'
import { createBasicHeaders } from '../../../src/lib/utils'

type NewTodo = Pick<Todo, "title" | "description">;



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // change that! 
    const name = "itpazu"
    const password = "morenito"
    let response;
    let headers = createBasicHeaders(name, password)
    response = await fetch('https://drag-n-drop-sandy.vercel.app/todos/',
        {
            method: "POST",
            headers,
            body: JSON.stringify(req.body),

        })
    let data = await response.json()

    console.log(data)
    if (response.status > 201) {

        return res.status(response?.status || 500).json(data)

    }
    res.revalidate('/')
    res.status(200).json({ ...data })





}