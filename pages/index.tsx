
import React, { ReactElement } from 'react';
import Todos from '../src/components/Todos';
import Layout from '../src/layouts/Layout';
import type { NextPageWithLayout } from './_app'
import useUser from '../src/components/hooks/useUser';


const initialData = { todos: [], completedTodos: [] }

const TodoMain: NextPageWithLayout = () => {
  useUser({ redirectIfFound: true, redirectTo: 'users/' })

  return (
    <>
      <Todos data={initialData} />

    </>

  );
}

TodoMain.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default TodoMain;