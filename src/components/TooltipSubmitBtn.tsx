import React, { useState } from 'react';
import Link from 'next/link'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';



const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} placement="top-end" />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.whiteTone,
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(14),
        border: `2px solid ${theme.palette.common.focusColor}`,
    },
}));

export default function SubmitBtnToolTip() {
    const [showTooltip, setShowTooltip] = useState(false)
    return (
        <HtmlTooltip
            open={showTooltip}
            onOpen={() => setShowTooltip(true)}
            onClose={() => setShowTooltip(false)}
            title={
                <React.Fragment>
                    <Typography color="inherit">
                        you are in "playground" mode.
                        {'  '}
                        <Link href={'/login'}>
                            Login
                        </Link> {' '}
                        or {' '}
                        <Link href={'/signup'}>
                            signup
                        </Link> {' '}
                        to store and retrieve your personal todos
                    </Typography>

                </React.Fragment>
            }
        >
            <span
                style={{ display: 'flex' }}
                onTouchStart={() => setShowTooltip(true)}
            >

                <Button
                    sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
                    color="secondary"
                    size="medium"
                    variant="contained"
                    disabled

                >submit changes</Button>
            </span>
        </HtmlTooltip>

    );
}
