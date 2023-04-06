
import React from "react";
import { Button, Grid } from "@mui/material";

export default function SubmitChanges({ changes }: { changes: Array<[string, boolean]> }) {


    return (
        <Grid item justifyContent={'center'}
            md={3}
            xs={12}
        >
            <Button variant="contained" disabled={(changes.length === 0)}> submit changes </Button>
        </Grid>
    )
}
