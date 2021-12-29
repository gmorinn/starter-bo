import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useApi } from '../Hooks/useApi';

const InputFileBrowser = ({ id, limit, value, set, ...rest }) => {

	const { Fetch } = useApi()

	const uploadFile = async e => {
		const files = e.target.files

		const formData = new FormData()
		formData.append('content', files[0])
	
		if (limit) {
			let fileSize = 0
			if (files && files[0]) {
				fileSize = files[0].size
			}
			if (fileSize > limit * 1024 * 1024) {
				toast.error("Error size of file", { position: "top-left",autoClose: 3000, theme: "dark"});
			} else {
				return Fetch(`/v1/bo/files/add`, "POST", formData, false).then(res => res?.success && res.success && set(res.file.url))
			}
		} else {
			return Fetch(`/v1/bo/files/add`, "POST", formData, false).then(res => res?.success && res.success && set(res.file.url))
		}
	}

	const removeFile = async () => {
		return Fetch(`/v1/bo/files/remove`, "PATCH", { url: value }, true)
			.then(res => res?.success && res.success && set(""))
	}

	console.log(process.env.REACT_APP_API_URL + value)

	return (
		<FormControl className="mt-5 w-100">
			<TextField id={id} {...rest} type="file" onChange={uploadFile} />
			{value !== "" && <small onClick={removeFile} className="text-danger text-center" style={{cursor: 'pointer'}}>Supprimer l'image actuelle</small>}
			{value !== "" && value.substring(0, 4) !== "http" && <img alt="logo" width={'50%'} className='mx-auto mt-3' src={process.env.REACT_APP_API_URL + value}/>}
		</FormControl>
	);
};

export default InputFileBrowser;