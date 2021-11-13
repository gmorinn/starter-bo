import React from "react";
import { Button, FormControl, Input, Box } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput.js";
import { useMutation } from "react-query";
import useRouter from "../../Hooks/useRouter.js";
import { useAuth } from '../../Hooks/useAuth'
import { toast } from 'react-toastify';
import Loader from '../Loader'
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'

const styles = {
    outline: '0',
    borderWidth:'0 0 1px',
    borderColor: 'black',
}

const SignIn = () => {

    const router = useRouter()
    const { signWithProvider, login } = useAuth()

    const signWithEmail = useMutation(api.SigninWithMailAndPassword, {
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
        }
    })

    const signWithGoogle = useMutation(() => api.SignWithGoogle(signWithProvider), {
        onSuccess: () => {
            toast.success("You're connected!", {
                position: "top-left",
                theme: "dark",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            router.push('/')
        }
    })

    const signWithFacebook = useMutation(api.SignWithFacebook, {
        onSuccess: () => {
            toast.success("You're connected!", {
                position: "top-left",
                theme: "dark",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            router.push('/')
        }
    })

    const schema = yup.object({
        email: yup.string().email().required(),
        password: yup.string().required().min(7),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const email = useInput("", "email", "email", "Email...", "w-100", styles)
    const password = useInput("", "password", "password", "Password...", "w-100", styles)

    const onSubmit = data => signWithEmail.mutate({ email: data.email, password: data.password, login});

    return (
        <>
        <div className="mt-5">
            <h2 className="mb-4">I already have an email !</h2>
            <span>Login</span>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">

                <FormControl className="mb-5 mt-5">
                    <Controller
                        {...email.bindHookForm}
                        control={control}
                        render={({ field }) => <Input {...field} {...email.bindInput} />}
                    />
                    {errors.email?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.email?.type === 'email' && <span className="text-danger">Wrong format</span>}
                </FormControl>

                <FormControl className="mb-5">
                    <Controller
                             {...password.bindHookForm}
                            control={control}
                            render={({ field }) => <Input {...field} {...password.bindInput} />}
                        />
                    {errors.password?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.password?.type === 'min' && <span className="text-danger">Too small</span>}
                </FormControl>

                <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2 text-white" type='submit' style={{backgroundColor: 'black'}} disabled={signWithEmail.isLoading}>
                    {signWithEmail.isLoading ? <Loader /> : <><Box component="i" marginRight="1rem"><AlternateEmailIcon /></Box>Login by mail</>}
                </Button>
                <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2" variant="contained" color='error' disabled={signWithGoogle.isLoading} onClick={signWithGoogle.mutate}>
                    {signWithGoogle.isLoading ? <Loader /> : <><Box component="i" marginRight="1rem"><GoogleIcon /></Box>Login with Google</>}
                </Button>
                <Button size="small" className="w-100 px-5 pt-3 pb-3" variant="contained" disabled={signWithFacebook.isLoading} onClick={signWithFacebook.mutate}>
                    {signWithFacebook.isLoading ? <Loader /> : <><Box component="i" marginRight="1rem"><FacebookIcon /></Box>Login with Facebook</>}
                </Button>
                {signWithEmail.isError && <span className="text-danger">* Email or password incorrect</span>}
                {signWithGoogle.isError && <span className="text-danger">* Error with Google, please try again or contact us.</span>}
                {signWithFacebook.isError && <span className="text-danger">* Error with Facebook, please try again or contact us.</span>}
            </form>
        </div>
        </>
    )
}

export default SignIn