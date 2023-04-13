
import React, { useState } from "react";
import { Button, Stack } from "@mui/material";
import { useGlobalContext, TodosFromProps } from "../context/globalContext";
import useFetchTodos from './hooks/useTodos';
import { fetcher } from '../lib/utils';
import Loader from './Loader';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
export default function SubmitChanges({
    areReordered,
}:
    {
        areReordered: boolean,
    }) {
    const { state, dispatch } = useGlobalContext()
    const { fieldsUpdates } = state;
    const [storeStatus, setStoreStatus] = useState({ error: false, message: '', showMessage: false })
    const [inProgress, setInprogress] = useState(false)
    const { data, error, isLoading, mutate } = useFetchTodos()




    const getUpdates = () => {
        // deleteing new items which has been also deleted
        return Object.values({ ...fieldsUpdates }).filter((item) => {
            const fallbackId = item?.id ?? 1
            return !(item.description === "delete" && fallbackId <= 0)
        })

    }


    const storeLocalChangesInDb = async () => {
        const body = getUpdates()
        console.log(body)
        try {
            setInprogress(true)
            const response = await fetcher({ endpoint: 'modify', method: "PUT", body })
            const data = await response.json()
            setInprogress(false)
            if (response.status === 200) {
                setStoreStatus(prev => ({
                    ...prev,
                    message: "successfully stored your changes!", showMessage: true
                }))
                const newData = await mutate()
                console.log(newData)
                dispatch({ type: "submitChanges", payload: { ...newData } })


            } else {
                const errorMessage = `changes were not stored,
                 try again: ${data?.detail || "unkown reason"}`
                setStoreStatus(prev => ({ ...prev, error: true, message: errorMessage, showMessage: true }))
            }
        } catch (err) {

            setStoreStatus(prev => ({
                ...prev, error: true,
                message: "seems like our server makes troubles...",
                showMessage: true
            }))


        }
    }
    return (
        <Stack
            direction="row"
            spacing={2}
            padding={2}
            sx={{ height: "100%" }}

        >
            <Loader open={inProgress} />
            {storeStatus.showMessage &&

                <Box
                    padding={0}
                    sx={(theme) => ({
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        bottom: '0px',
                        left: '0px',
                        height: '100vh',
                        width: '100vw',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: theme.zIndex.drawer + 1,
                        '&.MuiBox-root': { 'ml': '0px' }
                    })}>

                    <Alert sx={{
                        height: "40vh",
                        width: {
                            xs: "80vw",
                            md: '40vw',
                            lg: "30vw"
                        },
                        "&.MuiPaper-root": { justifyContent: "center", alignItems: "center" }
                    }}
                        severity={storeStatus.error ? "error" : "success"} >
                        <Stack sx={{ width: '100%' }} spacing={4} justifyContent={'center'} alignItems={'center'} >

                            <AlertTitle >
                                {storeStatus.error ? "something went wrong.." : "Awesome!"}
                            </AlertTitle>
                            <Typography>

                                {storeStatus.error ? `${storeStatus.message}` : "Your todos are safe and sound!"}
                            </Typography>
                            <Button variant="contained"
                                color={storeStatus.error ? "error" : "success"}
                                onClick={() => { setStoreStatus(prev => ({ ...prev, showMessage: false })) }}
                            >Got it</Button>
                        </Stack>
                    </Alert>
                </Box>
            }
            <Button

                sx={{ height: '100%', }}
                color="secondary"
                size="medium"
                variant="contained"
                onClick={storeLocalChangesInDb}
                disabled={
                    !areReordered && Object.keys(fieldsUpdates).length === 0}>
                submit changes
            </Button>
            <Button
                sx={{ backgroundColor: "#e57373" }}
                size="medium"
                variant="contained"
                disabled={
                    !areReordered && Object.keys(fieldsUpdates).length === 0
                }
                onClick={async () => {
                    dispatch({
                        type: 'discardLocalChanges', payload: { ...data }

                    })
                }}
            >
                discard changes
            </Button>

        </Stack >
    )
}
