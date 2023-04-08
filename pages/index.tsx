
import React from 'react';
import Todos from '../src/components/Todos';
import { GlobalContextProvider, State as FetchStateProp, Todo } from '../src/context/globalContext';
import { todoStatusDivider } from '../src/lib/utils';
import { fetcher } from '../src/lib/utils';

const ENDPOINT = 'todos/'
export const getStaticProps = async () => {

  try {
    const response = await fetcher({ endpoint: ENDPOINT })
    const data = await response.json()

    return {
      props: {
        ...todoStatusDivider(data)
      },
      // revalidate: 10
    };
  } catch (error) {
    return {
      props: {
        todos: [],
        completedTodos: []
      },
      // revalidate: 10
    };
  }

};
export default function TodoMain({ todos, completedTodos }: FetchStateProp) {
  // const data = useSWR('/api/todos', fetcher)
  return (
    <GlobalContextProvider FetchState={{ todos, completedTodos }}>
      <Todos originalTodos={{ todos, completedTodos }} />
    </GlobalContextProvider>


  );
}
