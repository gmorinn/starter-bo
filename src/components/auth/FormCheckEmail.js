import React from "react";
import { Button } from '@mui/material';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput.js";
import { useMutation } from "react-query";
import useRouter from "../../Hooks/useRouter.js";
import { toast } from 'react-toastify';
import { useApi } from "../../Hooks/useApi";
import Loader from '../Loader'
import UseFormGroup from "../../Hooks/useForm";

const CheckEmail = () => {

    const router = useRouter()
    const { Fetch } = useApi()

    const checkMail = async (data) => {
        await Fetch('/v1/bo/email-exist/code', "POST", data, true)
            .then(res => {
                if (res?.success && res.exist) console.log("succeed!")
                else if (res?.success && !res.exist) { throw "Email doesn't exist" }
            })
    }

    const { isLoading, mutate } = useMutation(checkMail, {
        onSuccess: () => {
            router.push('/forgot-password')
        },
        onError: () => {
            toast.error("Email doesn't exist!", {
                position: "top-left",
                autoClose: 3000,
                theme: "dark",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    })

    const schema = yup.object({
        email: yup.string().email().required(),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const email = useInput("", "email", "email", "Email...", "w-100")

    const onSubmit = data => mutate(data);

    return (
        <>
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                <div className="mb-5 w-75 mx-auto">
                    <UseFormGroup bind={email} control={control} />
                    {errors.email?.type === 'required' && <span className="mb-2">Required</span>}
                    {errors.email?.type === 'email' && <span className="mb-2">Wrong format</span>}
                </div>
                <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={isLoading}>
                    {isLoading ? <Loader /> : "Reset Password"}
                </Button>
            </form>
        </div>
        </>
    )
}

export default CheckEmail