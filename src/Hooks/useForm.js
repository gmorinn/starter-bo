import { DatePicker, LocalizationProvider } from "@mui/lab";
import { FormControl, Input, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import PhoneInput from "react-phone-input-2";

const UseFormGroup = ({ bind, phone, select, date, control, ...other }) => {
    return (
        <FormControl className="mt-5 w-100">
            {
                phone  ?  <InputPhone bind={bind} control={control} /> :
                select ?  <InputSelect bind={bind} control={control} {...other} /> :
                date   ?  <InputDate bind={bind} control={control} {...other} />
                       :  <InputText bind={bind} control={control} />
            }
        </FormControl>
    )
}

const InputPhone = ({ bind, control}) => {
    return (
        <Controller
            {...bind.bindHookForm}
            country={'fr'}
            onlyCountries={['fr', 're', 'be', 'yt', 'gf', 'pf', 'tf', 'mu']}
            control={control}
            render={({ field }) => <PhoneInput {...field} {...bind.bindInput} />}
        />
    )
}

const InputText = ({ bind, control }) => {
    return (
        <Controller
            {...bind.bindHookForm}
            control={control}
            render={({ field }) => <Input {...field} {...bind.bindInput} />}
        />
    )
}

const InputDate = ({ bind, format, label }) => {
    return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
            {...bind.bindHookForm}
            label={label}
            value={bind.value}
            type="date"
            inputFormat={format}
            onChange={v => bind.setValue(v)}
            renderInput={(params) => <TextField {...params} />}
        />
    </LocalizationProvider>
    )
}

const InputSelect = ({ bind, control, enums }) => {
    return (
        <Controller
            id="demo-simple-select-standard"
            {...bind.bindHookForm}
            control={control}
            render={({ field }) => 
                <Select {...field} {...bind.bindInput}>
                    {
                        enums.map((v, i) => {
                            return (
                                <MenuItem key={i} value={v.value}>{v.display}</MenuItem>
                            )
                        })
                    }
                </Select>
            }
        />
    )
}

export default UseFormGroup