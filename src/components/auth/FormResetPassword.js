import React from "react";
import { Button, Grid } from '@mui/material';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput.js";
import { useMutation } from "react-query";
import useRouter from "../../Hooks/useRouter.js";
import { toast } from 'react-toastify';
import { useApi } from "../../Hooks/useApi";
import Loader from '../Loader'
import UseFormGroup from "../../Hooks/useForm.js";

const FormResetPassword = () => {

    const router = useRouter()
    const { Fetch } = useApi()

    const resetPasswordWithCode = async (data) => {
        await Fetch('/v1/bo/email-exist/code', "POST", data, true)
            .then(res => {
                if (res?.success && res.exist) console.log("succeed!")
                else if (res?.success && !res.exist) { throw "Email doesn't exist" }
            })
    }

    const {isError, isLoading, mutate, error } = useMutation(resetPasswordWithCode, {
        onSuccess: () => {
            toast.success("You're connected!", {
                position: "top-left",
                autoClose: 3000,
                theme: "dark",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            router.push('/')
        },
    })

    const schema = yup.object({
        password: yup.string().required().min(7),
        code: yup.string().required().length(5),
        confirm_password: yup.string().required().min(7)
            .oneOf([yup.ref('password'), null], 'Password is different.'),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const password = useInput("", "password", "password", "Password...", "w-100")
    const confirm_password = useInput("", "confirm_password", "password", "Confirm password...", "w-100")
    const code = useInput("", "code", "text", "Secret code...", "w-100")

    const onSubmit = data => mutate(data);

    return (
        <>
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
                    <Grid item md={12} className="mb-1">
                        <UseFormGroup bind={password} control={control} />
                        {errors.password?.type === 'required' && <span className="text-danger">Required</span>}
                        {errors.password?.type === 'min' && <span className="text-danger">Too small</span>}
                    </Grid>
                    <Grid item md={12} className="mb-1">
                        <UseFormGroup bind={confirm_password} control={control} />
                        {errors.confirm_password?.type === 'required' && <span className="text-danger">Required</span>}
                        {errors.confirm_password?.type === 'min' && <span className="text-danger">Too small</span>}
                        {errors.confirm_password?.type === 'oneOf' && <span className="text-danger">Wrong password</span>}
                    </Grid>
                    <Grid item md={12} className="mb-5">
                        <UseFormGroup bind={code} control={control} />
                        {errors.code?.type === 'required' && <span className="text-danger">Required</span>}
                        {errors.code?.type === 'length' && <span className="text-danger">Wrong code</span>}
                    </Grid>
                </Grid>

                {isError && <span className="text-danger">{error}</span>}
                <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={isLoading}>
                    {isLoading ? <Loader /> : "Reset Password"}
                </Button>
            </form>
        </div>
        </>
    )
}

export default FormResetPassword