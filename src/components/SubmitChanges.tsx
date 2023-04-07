
import React from "react";
import { Button, Box } from "@mui/material";

export default function SubmitChanges({ changes, isReordered }: { changes: Array<[string, boolean]>, isReordered: boolean }) {

    console.log(changes.length === 0 && !isReordered)
    return (
        <Box
            component='form'
            sx={{
                padding: 4,
                '& .MuiTextField-root': { m: 1, width: '100%' },
            }}

        >
            <Button variant="contained" disabled={changes.length === 0 && !isReordered}> submit changes </Button>
        </Box>
    )
}
