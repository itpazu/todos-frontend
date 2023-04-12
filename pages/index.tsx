
import React from 'react';
import { TodosFromProps, Todo } from '../src/context/globalContext';
import { todoStatusDivider, fetcher as todoFetcher } from '../src/lib/utils';
import { SWRConfig } from 'swr';
import TodosContext from '../src/components/TodosContext';

const ENDPOINT = 'todos'

export const getStaticProps = async () => {

  try {
    const response = await todoFetcher({ endpoint: ENDPOINT })
    const data = await response.json()

    return {
      props: {

        fallback: {
          '/api/todos': { ...todoStatusDivider(data) }
        },
      }
    }
  } catch (error) {
    return {
      props: {
        todos: [],
        completedTodos: []
      },
    };
  }

};
export default function TodoMain({ fallback }: { fallback: TodosFromProps }) {
  return (
    <SWRConfig value={{
      fallback,
      // refreshInterval: 10000,
      onErrorRetry: (error, key, _, revalidate, { retryCount }) => {
        if (error.status === 404) return

        if (retryCount >= 5) return

        setTimeout(() => revalidate({ retryCount }), 5000)
      }
    }}>
      <TodosContext />
    </SWRConfig>


  );
}
