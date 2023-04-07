
import React, { useState, useEffect } from 'react';
import { Paper, Grid } from '@mui/material';
import Todos from '../src/components/Todos';
import { GlobalContextProvider, State as FetchStateProp, Todo } from '../src/context/globalContext';
import { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
import { createBasicHeaders, todoStatusDivider } from '../src/lib/utils';

export const getStaticProps = async () => {
  const headers = createBasicHeaders("itpazu", "morenito") //change that!

  try {
    const data = await fetch('https://drag-n-drop-sandy.vercel.app/todos', { headers })
    const jsonedResponse: Todo[] = await data.json()


    return {
      props: {
        ...todoStatusDivider(jsonedResponse)
      },
      revalidate: 10
    };
  } catch (error) {
    return { notFound: true }
  }

};
export default function TodoMain({ todos, completedTodos }: FetchStateProp) {
  // console.log('RES,', todos[todos.length - 1]);

  return (
    <GlobalContextProvider FetchState={{ todos, completedTodos }}>
      <Todos />
    </GlobalContextProvider>


  );
}
