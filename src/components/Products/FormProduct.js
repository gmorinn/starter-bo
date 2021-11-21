import React from "react";
import { toast } from 'react-toastify';
import { useMutation } from "react-query";
import { Button, FormControl, Grid, Input, MenuItem, Select } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput";
import Loader from '../Loader'
import { useApi } from "../../Hooks/useApi";

const FormProduct = () => {
    const { Fetch } = useApi()

    const addProduct = (data) => {
        Fetch('/v1/bo/product/add', "POST", data, true)
            .then(res => res.success && console.log(res))
    }

    const { isLoading, mutate, isError } = useMutation(addProduct, {
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
                <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
                    <Grid item md={6}>
                        <FormControl className="mb-5 mt-5 w-100">
                            <Controller
                                {...name.bindHookForm}
                                control={control}
                                render={({ field }) => <Input {...field} {...name.bindInput} />}
                            />
                            {errors.name?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.name?.type === 'min' && <span className="text-danger">3 minimum</span>}
                        </FormControl>
                    </Grid>

                    <Grid item md={6}>
                        <FormControl className="mb-5 mt-5 w-100">
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
                    </Grid>
                </Grid>
                <Button size="small" className="w-50 mx-auto px-5 pt-3 pb-3 mb-2 text-white" type='submit' style={{backgroundColor: 'black'}} disabled={isLoading}>
                    {isLoading ? <Loader /> : <>Add Product</>}
                </Button>
                {isError && <span className="text-danger">Error occured</span>}
            </form>
        </div>
        </>
    )
}

export default FormProduct