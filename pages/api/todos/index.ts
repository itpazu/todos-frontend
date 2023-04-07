import { NextApiResponse, NextApiRequest } from 'next'

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
    "id": 4,
    "title": "I am a completed item",
    "description": "first item to add",
    "created_at": "2023-04-04T23:14:02.830843+03:00",
    "completed": true,
    "user": "itpazu",
    "updated_at": "2023-04-04T23:14:02.830903+03:00"
  },
  {
    "id": 5,
    "title": "me too",
    "description": "goodby",
    "created_at": "2023-04-04T23:29:41.152817+03:00",
    "completed": true,
    "user": "itpazu",
    "updated_at": "2023-04-04T23:29:41.152843+03:00"
  },
  {
    "id": 6,
    "title": "well im completed number 3",
    "description": "last todo",
    "created_at": "2023-04-04T23:36:19.550944+03:00",
    "completed": true,
    "user": "itpazu",
    "updated_at": "2023-04-04T23:36:19.550983+03:00"
  }
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return
  } else {
    res.status(200).json({ todos: MOCK, completedTodos: MOCK2 })
  }
}