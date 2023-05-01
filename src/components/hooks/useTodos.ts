import useSWR from 'swr'
import React, { useEffect } from 'react'
import { TodosFromProps } from '../../../src/context/globalContext';
import useUser from '../hooks/useUser'

export default function useFetchTodos() {
    const { user } = useUser()

    const { data, error, isLoading, mutate } = useSWR<TodosFromProps>(
        !!user?.isLoggedIn ? `/api/todos` : null,
    )
    useEffect(() => {
        if (error) {
            mutate({ todos: [], completedTodos: [] })
        }
        else {
            mutate()
        }

    }, [user?.isLoggedIn])

    return {
        data,
        isLoading,
        error,
        mutate
    }
}