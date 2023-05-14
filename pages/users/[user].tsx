
import React, { ReactElement, useEffect } from 'react';
import Todos from 'src/components/Todos';
import Layout from 'src/layouts/Layout';
import type { NextPageWithLayout } from '../_app'
import useFetchTodos from 'src/components/hooks/useTodos'
import useUser from 'src/components/hooks/useUser';
import { useAppDispatch } from 'src/store/reduxHooks';
import { todos } from 'src/store/todosSlice';

const initialData = { todos: [], completedTodos: [] }

const TodoMain: NextPageWithLayout = () => {
    useUser({ redirectTo: '/' })
    const reduxDispatch = useAppDispatch()
    const { data, isLoading, isValidating } = useFetchTodos()

    useEffect(() => {
        if (data) {
            reduxDispatch(todos(data))
        }
        return () => { reduxDispatch(todos(initialData)) }
    }, [data, reduxDispatch]
    )

    return (
        <>

            <Todos isLoading={isLoading || isValidating} data={data ?? initialData} />

        </>

    );
}

TodoMain.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout >
            {page}
        </Layout>
    )
}

export default TodoMain;