import { Card, CardContent, FormControlLabel, Grid, Switch } from "@mui/material";
import React from "react";
import { useRecoilState } from "recoil";
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { darkModeAtom } from "../store/mode";
import FormCheckEmail from "../components/auth/FormCheckEmail";

const ForgotPassword = () => {
    const [mode, setMode] = useRecoilState(darkModeAtom)

    return (
        <Grid container className="justify-content-center">
            <Grid item sm={10} md={8} lg={6} className="min-vh-100" sx={{ width: '100%' }}>
                <Card className="border border-dark">
                    <FormControlLabel onChange={() => setMode(v => !v)} control={<Switch value={mode} />} label="Dark Mode" className="p-3" />
                    <WhatshotIcon sx={{ fontSize: 40 }} className="mt-5 w-100 d-flex justify-content-center"/>
                    <CardContent>
                        <h3 className="text-center">Reset your Password</h3>
                        <h5 className="text-center">Step 1/2</h5>
                       <FormCheckEmail />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default ForgotPassword