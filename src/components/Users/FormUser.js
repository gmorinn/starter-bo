import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useMutation } from "react-query";
import { Button, FormControl, Grid, Input, TextField } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput";
import Loader from '../Loader'
import PhoneInput from 'react-phone-input-2'
import { useApi } from "../../Hooks/useApi";
import moment from 'moment'
import 'react-phone-input-2/lib/material.css'

const FormUser = () => {
    const { Fetch } = useApi()

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
        }
    })

    const schema = yup.object({
        firstname: yup.string().min(3).required(),
        lastname: yup.string().min(3).required(),
        email: yup.string().email().required(),
      });

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const firstname = useInput("", "firstname", "text", "Firstname...", "w-100")
    const lastname = useInput("", "lastname", "text", "Lastname...", "w-100")
    const email = useInput("", "email", "email", "Email...", "w-100")
    const [birthday, setBirthday] = useState(null);
    const [phone, setPhone] = useState(null);

    const onSubmit = data => mutate({ firstname: data.firstname,
                                lastname: data.lastname,
                                email: data.email,
                                birthday: birthday ? moment(birthday).format('DD-MM-YYYY') : null,
                                phone: "+"+phone,
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
                            <PhoneInput
                                value={phone}
                                country={'fr'}
                                onlyCountries={['fr', 're', 'be', 'yt', 'gf', 'pf', 'tf', 'mu']}
                                onChange={newPhone => setPhone(newPhone)}
                            />
                        </FormControl>
                    </Grid>
                </Grid>



                <Button size="small" className="w-50 mx-auto px-5 pt-3 pb-3 mb-2 text-white" type='submit' style={{backgroundColor: 'black'}} disabled={isLoading}>
                    {isLoading ? <Loader /> : <>Add User</>}
                </Button>
                {isError && <span className="text-danger">Error occured</span>}
            </form>
    )
}

export default FormUser