
import React, { useState, useEffect } from 'react';
import { Paper, Grid } from '@mui/material';
import Todos from '../src/components/Todos';
import { GlobalContextProvider, State as FetchStateProp } from '../src/context/globalContext';
import { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
import useSWR from 'swr';

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
//  const fetcher = (url: string) => fetch(url).then(res=>res.json)
export const getStaticProps: GetStaticProps<{ [index: string]: typeof MOCK }> = async (context) => {
  // const headers = new Headers()
  // headers.set('Authorization', 'Basic ' + Buffer.from("itpazu" + ":" + "morenito").toString('base64'));
  // console.log(process.env)
  // const data = await fetch('https://drag-n-drop-sandy.vercel.app/todos', { headers })
  // const RES = await data.json()

  // console.log('RES,', data.status);

  return {
    props: {
      todos: MOCK, completedTodos: MOCK2
    },
    revalidate: 60,
  };
};
export default function TodoMain({ todos, completedTodos }: FetchStateProp) {
  // fetch('/api/todos')
  //   .then((res) => res.json())
  //   .then((data) => console.log(data))


  // const [todos, setTodos] = useState(MOCK)
  // const [completedTodos, setcompletedTodos] = useState(MOCK2)
  // const { state, dispatch } = useGlobalContext()
  // const { dispatch } = useGlobalContext()

  // useEffect(() => {
  //   dispatch({ type: "todos", payload: { todos, completedTodos } })
  //   console.log('remounted')
  // }, [])

  return (
    <GlobalContextProvider FetchState={{ todos, completedTodos }}>

      <Todos />
    </GlobalContextProvider>


  );
}
