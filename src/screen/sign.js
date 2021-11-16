import React, { lazy } from "react";
import { Grid, Card, CardContent } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const Login = lazy(() => import("../components/auth/Login"))


const Sign = () => {
    return (
        <>
            <Grid container className="justify-content-center">
                <Grid item sm={10} md={8} lg={6} className="min-vh-100" sx={{ width: '100%' }}>
                    <Card className="border border-dark">
                        <WhatshotIcon sx={{ fontSize: 40 }} className="mt-5 w-100 d-flex justify-content-center"/>
                        <CardContent>
                            <Login />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default Sign