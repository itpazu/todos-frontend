
import React, { ReactElement, useEffect } from 'react';
import Todos from '../../src/components/Todos';
import Layout from '../../src/layouts/Layout';
import type { NextPageWithLayout } from '../_app'
import useFetchTodos from '../../src/components/hooks/useTodos'
import { useGlobalContext } from '../../src/context/globalContext';
import useUser from '../../src/components/hooks/useUser';
import useSWR from 'swr'

const initialData = { todos: [], completedTodos: [] }

const TodoMain: NextPageWithLayout = () => {
    const { user, mutateUser, } = useUser()
    console.log(user)
    const { data, isLoading } = useFetchTodos(false)
    const { dispatch } = useGlobalContext()

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