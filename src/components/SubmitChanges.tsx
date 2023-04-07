
import React from "react";
import { Button, Box } from "@mui/material";

export default function SubmitChanges({ changes }: { changes: Array<[string, boolean]> }) {


    return (
        <Box
            component='form'
            sx={{
                padding: 4,
                '& .MuiTextField-root': { m: 1, width: '100%' },
            }}

        >
            <Button variant="contained" disabled={(changes.length === 0)}> submit changes </Button>
        </Box>
    )
}
