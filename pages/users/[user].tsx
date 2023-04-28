
import React, { ReactElement, useEffect } from 'react';
import Todos from '../../src/components/Todos';
import Layout from '../../src/layouts/Layout';
import type { NextPageWithLayout } from '../_app'
import useFetchTodos from '../../src/components/hooks/useTodos'
import { useGlobalContext } from '../../src/context/globalContext';
import useUser from '../../src/components/hooks/useUser';

const initialData = { todos: [], completedTodos: [] }

const TodoMain: NextPageWithLayout = () => {
    const { user } = useUser({ key: "../api/auth/user", redirectTo: '/' })
    const { data, isLoading } = useFetchTodos(!!user?.isLoggedIn)
    const { dispatch } = useGlobalContext()
    console.log('data', data)

    useEffect(() => {
        dispatch({ type: "submitChanges", payload: { ...data } })
    }, [data]
    )

    return (
        <>

            <Todos isLoading={isLoading} data={data ?? initialData} />

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