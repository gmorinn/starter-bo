import React from "react";
import { FormControl, Input, Button, Box } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput.js";
import { useMutation } from "react-query";
import useRouter from "../../Hooks/useRouter.js";
import { useAuth } from '../../Hooks/useAuth'
import { toast } from 'react-toastify';
import * as api from '../../utils/api'
import Loader from '../Loader'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'

const FormLogin = () => {

    const router = useRouter()
    const { login } = useAuth()

    const {isError, isLoading, mutate, error } = useMutation(api.SigninWithMailAndPassword, {
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
        email: yup.string().email().required(),
        password: yup.string().required().min(7),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const email = useInput("", "email", "email", "Email...", "w-100")
    const password = useInput("", "password", "password", "Password...", "w-100")

    const onSubmit = data => mutate({ email: data.email, password: data.password, login});

    return (
        <>
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">

                <FormControl className="mb-5 mt-5 mx-auto" sx={{ width: '60%' }}>
                    <Controller
                        {...email.bindHookForm}
                        control={control}
                        render={({ field }) => <Input {...field} {...email.bindInput} />}
                    />
                    {errors.email?.type === 'required' && <span className="mb-2">Required</span>}
                    {errors.email?.type === 'email' && <span className="mb-2">Wrong format</span>}
                </FormControl>

                <FormControl className="mb-5 mx-auto" sx={{ width: '60%' }}>
                    <Controller
                             {...password.bindHookForm}
                            control={control}
                            render={({ field }) => <Input {...field} {...password.bindInput} />}
                        />
                    {errors.password?.type === 'required' && <span className="mb-2">Required</span>}
                    {errors.password?.type === 'min' && <span className="mb-2">Too small</span>}
                {isError && <span className="text-danger">{error}</span>}
                </FormControl>
                <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2 text-white" type='submit' style={{backgroundColor: 'black'}} disabled={isLoading}>
                    {isLoading ? <Loader /> : <><Box component="i" marginRight="1rem"><AlternateEmailIcon /></Box>Login by mail</>}
                </Button>
            </form>
        </div>
        </>
    )
}

export default FormLogin