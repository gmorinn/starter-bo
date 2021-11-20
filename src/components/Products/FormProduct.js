import React from "react";
import { toast } from 'react-toastify';
import { useMutation } from "react-query";
import { Button, FormControl, Input, MenuItem, Select } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput";
import useRouter from "../../Hooks/useRouter";
import Loader from '../Loader'
import { useApi } from "../../Hooks/useApi";

const FormProduct = () => {
    const router = useRouter()
    const { Fetch } = useApi()

    const addProduct = (data) => {
        Fetch('/v1/bo/product/add', "POST", data, true)
            .then(res => res.success && console.log(res))
    }

    const { isLoading, mutate, isError } = useMutation(addProduct, {
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
        name: yup.string().min(3).required(),
        category: yup.string().oneOf(["men", "women", "jacket", "hat", "sneaker"]).required(),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const name = useInput("", "name", "text", "Name...", "w-100")
    const category = useInput("men", "category", "text", "Category...", "w-100")

    const onSubmit = data => mutate(data);

    return (
        <>
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">

                <FormControl className="mb-5 mt-5">
                    <Controller
                        {...name.bindHookForm}
                        control={control}
                        render={({ field }) => <Input {...field} {...name.bindInput} />}
                    />
                    {errors.name?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.name?.type === 'min' && <span className="text-danger">3 minimum</span>}
                </FormControl>

                <FormControl className="mb-5 mt-5">
                     <Controller
                        id="demo-simple-select-standard"
                        {...category.bindHookForm}
                        control={control}
                        render={({ field }) => 
                            <Select {...field} {...name.bindInput}>
                                <MenuItem value="men">Men</MenuItem>
                                <MenuItem value="women">Women</MenuItem>
                                <MenuItem value="sneaker">Sneaker</MenuItem>
                                <MenuItem value="jacket">Jacket</MenuItem>
                                <MenuItem value="hat">Hat</MenuItem>
                            </Select>
                        }
                    />
                    {errors.category?.type === 'required' && <span className="text-danger">Required</span>}
                </FormControl>

                <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2 text-white" type='submit' style={{backgroundColor: 'black'}} disabled={isLoading}>
                    {isLoading ? <Loader /> : <>Add Product</>}
                </Button>
                {isError && <span className="text-danger">Error occured</span>}
            </form>
        </div>
        </>
    )
}

export default FormProduct