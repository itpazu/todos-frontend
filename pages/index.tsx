
import React from 'react';
import { TodosFromProps, Todo } from '../src/context/globalContext';
import { todoStatusDivider, fetcher as todoFetcher } from '../src/lib/utils';
import { SWRConfig } from 'swr';
import TodosContext from '../src/components/TodosContext';

const ENDPOINT = 'todos'

export const getStaticProps = async () => {
  const userName = process.env.USERNAME
  const password = process.env.PASSWORD
  try {
    const response = await todoFetcher({
      endpoint: ENDPOINT, credentials: {
        name: userName || '',
        password: password || ''
      },
    })
    const data = await response.json()
    return {
      props: {

        fallback: {
          '/api/todos': { ...todoStatusDivider(data) }
        },
        revalidate: 100
      }
    }
  } catch (error) {
    return {
      props: {
        InitialData: {

          todos: [],
          completedTodos: []
        }

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
