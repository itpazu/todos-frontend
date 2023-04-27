import useSWR, { Fetcher } from 'swr'
import axios from 'axios'
import { TodosFromProps } from '../../../src/context/globalContext';

// const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function useFetchTodos(isUser: boolean) {
    const { data, error, isLoading, mutate } = useSWR<TodosFromProps>(
        isUser ? `/api/todos` : null,
    )


    return {
        data,
        isLoading,
        error,
        mutate
    }
}