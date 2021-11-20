import React from "react";
import { toast } from 'react-toastify';
import { useMutation } from "react-query";
import { Button, FormControl, Input } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput";
import useRouter from "../../Hooks/useRouter";
import Loader from '../Loader'
import { useApi } from "../../Hooks/useApi";

const FormUser = () => {
    const router = useRouter()
    const { Fetch } = useApi()

    const addUser = (data) => {
        // Fetch('/v1/bo/user/add', "POST", data, true)
        //     .then(res => res.success && console.log(res))
        console.log(data)
    }

    const { isLoading, mutate, isError } = useMutation(addUser, {
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

    const schema = yup.object({
        firstname: yup.string().min(3).required(),
        lastname: yup.string().min(3).required(),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const firstname = useInput("", "firstname", "text", "Firstname...", "w-100")
    const lastname = useInput("", "lastname", "text", "Lastname...", "w-100")

    const onSubmit = data => mutate(data);
    return (
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">

                <FormControl className="mb-5 mt-5">
                    <Controller
                        {...firstname.bindHookForm}
                        control={control}
                        render={({ field }) => <Input {...field} {...firstname.bindInput} />}
                    />
                    {errors.firstname?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.firstname?.type === 'min' && <span className="text-danger">3 minimum</span>}
                </FormControl>

                <FormControl className="mb-5 mt-5">
                    <Controller
                        {...lastname.bindHookForm}
                        control={control}
                        render={({ field }) => <Input {...field} {...lastname.bindInput} />}
                    />
                    {errors.lastname?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.lastname?.type === 'min' && <span className="text-danger">3 minimum</span>}
                </FormControl>

                <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2 text-white" type='submit' style={{backgroundColor: 'black'}} disabled={isLoading}>
                    {isLoading ? <Loader /> : <>Add User</>}
                </Button>
                {isError && <span className="text-danger">Error occured</span>}
            </form>
    )
}

export default FormUser