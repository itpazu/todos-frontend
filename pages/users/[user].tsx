
import React, { ReactElement, useEffect } from 'react';
import Todos from '../../src/components/Todos';
import Layout from '../../src/layouts/Layout';
import type { NextPageWithLayout } from '../_app'
import useFetchTodos from '../../src/components/hooks/useTodos'
import { useGlobalContext } from '../../src/context/globalContext';
import useUser from '../../src/components/hooks/useUser';

const initialData = { todos: [], completedTodos: [] }

const TodoMain: NextPageWithLayout = () => {
    useUser({ redirectTo: '/' })
    const { data, isLoading, isValidating } = useFetchTodos()
    const { dispatch } = useGlobalContext()

    useEffect(() => {
        dispatch({ type: "submitChanges", payload: { ...data } })
        return () => dispatch({ type: "submitChanges", payload: { ...data } })
    }, [data, dispatch]
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