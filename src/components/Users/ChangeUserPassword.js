import React, { useEffect } from "react";
import { toast } from 'react-toastify';
import { useMutation } from "react-query";
import { Button, FormControl, Grid, Input } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput";
import Loader from '../Loader'
import useRouter from "../../Hooks/useRouter";
import Err from '../../utils/humanResp'
import { useAuth } from "../../Hooks/useAuth";

const defaultForm = {
    confirm: "",
    password:"",
}

const ChangeUserPassword = () => {
    const { newPassword } = useAuth()

    const router = useRouter()

    // FETCH TO CHANGE ITEM
    const changePassword = async ({ password, confirm }) => {
        await newPassword(password, confirm, router.query.id)
            .then(res => {
                if (res?.success) console.log("succeed!")
                else { throw Err(res) }
            })
    }

    // START REACT QUERY
    const { isLoading, mutate, isError, error } = useMutation(changePassword, {
        onSuccess: () => {
            toast.success("Success !", {
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

    // ADD VALIDATION
    const schema = yup.object({
        password: yup.string().required().min(7),
        confirm: yup.string().required().min(7)
            .oneOf([yup.ref('password'), null], 'Password is different.'),
      });


    // START HOOK FORM
    const { handleSubmit, control, reset, formState: { errors, isSubmitSuccessful } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultForm
    });

    // RESET FORM
    useEffect(() => {
        if (isSubmitSuccessful) {
          reset(defaultForm);
        }
      }, [isSubmitSuccessful, reset]);

    // ALL INPUT USED
    const password = useInput("", "password", "password", "Password...", "w-100")
    const confirm = useInput("", "confirm", "password", "Confirm password...", "w-100")

    // JSON SEND TO THE API
    const onSubmit = data => mutate(data)

    return (
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
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
                                {...confirm.bindHookForm}
                                control={control}
                                render={({ field }) => <Input {...field} {...confirm.bindInput} />}
                            />
                            {errors.confirm?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.confirm?.type === 'min' && <span className="text-danger">Too small</span>}
                            {errors.confirm?.type === 'oneOf' && <span className="text-danger">Wrong password</span>}
                    </FormControl>
                    </Grid>
                </Grid>



                <Button size="small" className="w-50 mx-auto px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={isLoading}>
                    {isLoading ? <Loader /> : <>Change Password</>}
                </Button>
                {isError && <span className="text-danger text-center">{error}</span>}
            </form>
    )
}

export default ChangeUserPassword