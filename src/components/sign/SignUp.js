import React, { useState } from "react";
import { Button, FormControl, Input, Box, Grid, TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import useInput from "../../Hooks/useInput.js";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import * as yup from "yup";
import useRouter from "../../Hooks/useRouter.js";
import { useMutation } from "react-query";
import { toast } from 'react-toastify';
import Loader from '../Loader'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import { useAuth } from "../../Hooks/useAuth.js";

const styles = {
    outline: '0',
    borderWidth:'0 0 1px',
    borderColor: 'black',
}

const SignUp = () => {

    const router = useRouter()
    const { signup } = useAuth()

    const {mutate, isLoading, isError} = useMutation(api.SignupWithMailAndPassword, {
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
        firstname: yup.string().required().min(3),
        lastname: yup.string().required().min(3),
        email: yup.string().email().required(),
        password: yup.string().required().min(7),
        confirmPassword: yup.string().required().min(7)
            .oneOf([yup.ref('password'), null], 'Password is different.'),
      }).required();


    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const firstname = useInput("", "firstname", "text", "Firstname...", "w-100", styles)
    const lastname = useInput("", "lastname", "text", "Lastname...", "w-100", styles)
    const email = useInput("", "email", "email", "Email...", "w-100", styles)
    const password = useInput("", "password", "password", "Password...", "w-100", styles)
    const confirmPassword = useInput("", "confirmPassword", "password", "Confirm password...", "w-100", styles)
    const [birthday, setBirthday] = useState(null);
    const [phone, setPhone] = useState(null);

    const onSubmit = data => mutate({   signup, 
                                        email: data.email,
                                        firstname: data.firstname,
                                        lastname: data.lastname,
                                        password: data.password,
                                        confirm_password: data.confirmPassword,
                                        phone: phone,
                                        birthday: birthday
                                    });

    return (
        <div className="mt-5">
            <h2 className="mb-4">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">

            <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 5 }}>
                <Grid item md={6}>
                    <FormControl className="mb-5 mt-5" sx={{ m: 2 }} >
                        <Controller
                            {...firstname.bindHookForm}
                            control={control}
                            render={({ field }) => <Input {...field} {...firstname.bindInput} />}
                        />
                    {errors.firstname?.type === 'required' && <span className="text-danger">Required</span>}
                    </FormControl>

                    <FormControl className="mb-5 mt-5" sx={{ m: 2 }}>
                        <Controller
                            {...lastname.bindHookForm}
                            control={control}
                            render={({ field }) => <Input {...field} {...lastname.bindInput} />}
                        />
                    {errors.lastname?.type === 'required' && <span className="text-danger">Required</span>}
                    </FormControl>

                    <FormControl className="mb-5 mt-5" sx={{ m: 2 }}>
                        <Controller
                            {...password.bindHookForm}
                            control={control}
                            render={({ field }) => <Input {...field} {...password.bindInput} />}
                        />
                    {errors.password?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.password?.type === 'min' && <span className="text-danger">Too small</span>}
                    </FormControl>

                    <FormControl className="mb-5 mt-5">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                className="w-100"
                                label="Birthday"
                                value={birthday}
                                type="date"
                                inputFormat="MM/dd/yyyy"
                                onChange={newBirthday => setBirthday(newBirthday)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                <Grid item md={6}>
                    <FormControl className="mb-5 mt-5" sx={{ m: 2 }}>
                        <Controller
                            {...email.bindHookForm}
                            control={control}
                            render={({ field }) => <Input {...field} {...email.bindInput} />}
                        />
                    {errors.email?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.email?.type === 'email' && <span className="text-danger">Wrong format</span>}
                    </FormControl>

                    <FormControl className="mb-5 mt-5" sx={{ m: 2 }}>
                        <Box>
                            <PhoneInput
                                value={phone}
                                country={'fr'}
                                onlyCountries={['fr', 're', 'be', 'yt', 'gf', 'pf', 'tf', 'mu']}
                                onChange={newPhone => setPhone(newPhone)}
                            />
                        </Box>
                    </FormControl>

                    <FormControl className="mb-5 mt-5" sx={{ m: 2 }}>
                        <Controller
                            {...confirmPassword.bindHookForm}
                            control={control}
                            render={({ field }) => <Input {...field} {...confirmPassword.bindInput} />}
                        />
                    {errors.confirmPassword?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.confirmPassword?.type === 'min' && <span className="text-danger">Too small</span>}
                    {errors.confirmPassword?.type === 'oneOf' && <span className="text-danger">Wrong password</span>}
                    </FormControl>
                </Grid>
            </Grid>

                <Button className="w-100 px-5 pt-3 pb-3" type='submit' disabled={isLoading} variant="outlined">
                    {isLoading ? <Loader /> : <><Box component="i" marginRight="1rem"><AlternateEmailIcon /></Box>Register</>}
                </Button>
                {isError && <span>Error. Please try again.</span>}
            </form>
        </div>
    )
}

export default SignUp