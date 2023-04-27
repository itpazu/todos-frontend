
import React, { useState } from "react";
import { Button, Stack } from "@mui/material";
import { useGlobalContext, Todo } from "../context/globalContext";
import useFetchTodos from './hooks/useTodos';
import Loader from './Loader';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import axios from "axios";
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
    const { data: asFreshTodos, mutate } = useFetchTodos()

    const removeTemporaryIds = (changesArr: Array<Partial<Todo>>) => {
        return changesArr.map((item) => {
            const fallbackId = item?.id ?? -1
            if (fallbackId <= 0) {
                delete item.id
            }
            return item
        })
    }

    const storeLocalChangesInDb = async () => {
        const body = removeTemporaryIds(Object.values({ ...fieldsUpdates }))
        try {
            setInprogress(true)
            const response = await axios.post('/api/todos/modify', body)
            setInprogress(false)
            if (response.status === 200) {
                setStoreStatus(prev => ({
                    ...prev,
                    message: "successfully stored your changes!", showMessage: true
                }))
                const res = await mutate()

                dispatch({ type: "submitChanges", payload: { ...res } })


            } else {
                const errorMessage = `changes were not stored,
                 try again: ${response.data?.detail || "unkown reason"}`
                setStoreStatus(prev => ({ ...prev, error: true, message: errorMessage, showMessage: true }))
            }
        } catch (err) {
            setInprogress(false)

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
            width={'100%'}
            minHeight={'80px'}
            maxHeight={'80px'}
            paddingTop={2}
            paddingBottom={2}
            justifyContent={{ xs: 'center', md: "flex-start" }}
            sx={{ height: "fit-content" }}

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
                        alignItems: 'flex-start',
                        zIndex: theme.zIndex.drawer + 1,
                        '&.MuiBox-root': { 'ml': '0px' }
                    })}>

                    <Alert sx={{
                        minHeight: "40vh",
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
                                onClick={() => {
                                    setStoreStatus(prev => ({ ...prev, showMessage: false }))

                                }}

                            >Got it</Button>
                        </Stack>
                    </Alert>
                </Box>
            }
            <Button
                sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
                color="secondary"
                size="medium"
                variant="contained"
                onClick={storeLocalChangesInDb}
                disabled={
                    !areReordered && Object.keys(fieldsUpdates).length === 0}>
                submit changes
            </Button>
            <Button
                sx={{ fontSize: { xs: "0.8rem", md: "1rem" }, backgroundColor: "#e57373" }}

                size="medium"
                variant="contained"
                disabled={
                    !areReordered && Object.keys(fieldsUpdates).length === 0
                }
                onClick={async () => {
                    dispatch({
                        type: 'discardLocalChanges', payload: { ...asFreshTodos }

                    })
                }}
            >
                discard changes
            </Button>

        </Stack >
    )
}
