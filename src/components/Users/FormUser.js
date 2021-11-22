import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useMutation } from "react-query";
import { Button, FormControl, Grid, Input, Select, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput";
import Loader from '../Loader'
import PhoneInput from 'react-phone-input-2'
import { useApi } from "../../Hooks/useApi";
import useRouter from "../../Hooks/useRouter";
import moment from 'moment'
import 'react-phone-input-2/lib/material.css'

const FormUser = ({ add, edit, formData }) => {
    const { Fetch } = useApi()

    const router = useRouter()

    const addUser = (data) => {
        Fetch('/v1/bo/user/add', "POST", data, true)
            .then(res => res.success && console.log(res))
    }

    const { isLoading, mutate, isError } = useMutation(addUser, {
        onSuccess: () => {
            toast.success("Add!", {
                position: "top-left",
                autoClose: 3000,
                theme: "dark",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            router.push('/users')
        }
    })

    const schema = yup.object({
        firstname: yup.string().min(3).required(),
        lastname: yup.string().min(3).required(),
        email: yup.string().email().required(),
        password: yup.string().required().min(7),
        role: yup.string().oneOf(["user", "pro", "admin"]).required(),
        confirmPassword: yup.string().required().min(7)
            .oneOf([yup.ref('password'), null], 'Password is different.'),
      });

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const firstname = useInput(formData ? formData.firstname : "", "firstname", "text", "Firstname...", "w-100")
    const lastname = useInput(formData ? formData.lastname : "", "lastname", "text", "Lastname...", "w-100")
    const email = useInput(formData ? formData.email : "", "email", "email", "Email...", "w-100")
    const password = useInput("", "password", "password", "Password...", "w-100")
    const confirmPassword = useInput("", "confirmPassword", "password", "Confirm password...", "w-100")
    const phone = useInput(null, "phone", "phone", "Phone number...", "w-100")
    const role = useInput("user", "role", "text", "Role...", "w-100")
    const [birthday, setBirthday] = useState(formData ? moment(formData.birthday) : null);

    const onSubmit = data => mutate({ firstname: data.firstname,
                                lastname: data.lastname,
                                email: data.email,
                                birthday: birthday ? moment(birthday).format('DD-MM-YYYY') : null,
                                phone: data.phone ? "+"+data.phone : null,
                                role: data.role,
                                password: data.password,
                                confirm_password: data.confirmPassword,
                            });

    return (
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                 <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
                    <Grid item md={6}>
                        <FormControl className="mb-5 mt-5 w-100">
                            <Controller
                                {...firstname.bindHookForm}
                                control={control}
                                render={({ field }) => <Input {...field} {...firstname.bindInput} />}
                            />
                            {errors.firstname?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.firstname?.type === 'min' && <span className="text-danger">3 minimum</span>}
                        </FormControl>
                    </Grid>

                    <Grid item md={6}>
                        <FormControl className="mb-5 mt-5 w-100">
                            <Controller
                                {...lastname.bindHookForm}
                                control={control}
                                render={({ field }) => <Input {...field} {...lastname.bindInput} />}
                            />
                            {errors.lastname?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.lastname?.type === 'min' && <span className="text-danger">3 minimum</span>}
                        </FormControl>
                    </Grid>

                    <Grid item md={6}>
                        <FormControl className="mb-5 mt-5 w-100">
                            <Controller
                                {...email.bindHookForm}
                                control={control}
                                render={({ field }) => <Input {...field} {...email.bindInput} />}
                            />
                            {errors.email?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.email?.type === 'email' && <span className="text-danger">Wrong format</span>}
                        </FormControl>
                    </Grid>

                    <Grid item md={6}>
                        <FormControl className="mb-5 mt-5 w-100">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
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
                        <FormControl className="mb-5 mt-5 w-100">
                            <Controller
                                    {...phone.bindHookForm}
                                    country={'fr'}
                                    onlyCountries={['fr', 're', 'be', 'yt', 'gf', 'pf', 'tf', 'mu']}
                                    control={control}
                                    render={({ field }) => <PhoneInput {...field} {...phone.bindInput} />}
                                />
                        </FormControl>
                    </Grid>

                    <Grid item md={6}>
                        <FormControl className="mb-5 mt-5 w-100">
                            <Controller
                                id="demo-simple-select-standard"
                                {...role.bindHookForm}
                                control={control}
                                render={({ field }) => 
                                    <Select {...field} {...role.bindInput}>
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="pro">Pro</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                }
                            />
                            {errors.role?.type === 'required' && <span className="text-danger">Required</span>}
                        </FormControl>
                    </Grid>
                    { add && 
                        <>
                            <Grid item md={6}>
                                <FormControl className="mb-5 mt-5 w-100">
                                    <Controller
                                        {...password.bindHookForm}
                                        control={control}
                                        render={({ field }) => <Input {...field} {...password.bindInput} />}
                                    />
                                    {errors.password?.type === 'required' && <span className="text-danger">Required</span>}
                                    {errors.password?.type === 'min' && <span className="text-danger">Too small</span>}
                                </FormControl>
                            </Grid>
                            <Grid item md={6}>
                                <FormControl className="mb-5 mt-5 w-100">
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
                        </>
                    }
                </Grid>



                <Button size="small" className="w-50 mx-auto px-5 pt-3 pb-3 mb-2 text-white" type='submit' style={{backgroundColor: 'black'}} disabled={isLoading}>
                    {isLoading ? <Loader /> : <>Add User</>}
                </Button>
                {isError && <span className="text-danger">Error occured</span>}
            </form>
    )
}

export default FormUser