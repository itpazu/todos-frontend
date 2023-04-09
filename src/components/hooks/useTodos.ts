import useSWR, { Fetcher } from 'swr'
import axios from 'axios'
import { TodosFromProps } from '../../../src/context/globalContext';

const fetcher: Fetcher<TodosFromProps, string> = (url) => axios.get(url).then(res => res.data)

export default function useFetchTodos() {
    const { data, error, isLoading, mutate } = useSWR<TodosFromProps>(`/api/todos`, fetcher)

    return {
        data,
        isLoading,
        error,
        mutate
    }
}