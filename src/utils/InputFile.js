import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useApi } from '../Hooks/useApi';

const InputFileBrowser = ({ id, limit, value, set, ...rest }) => {

	const { Fetch } = useApi()

	console.log(value)

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

	return (
		<>
			<TextField id={id} {...rest} type="file" onChange={uploadFile} />
			{value !== "" && <small onClick={removeFile} className="text-danger" style={{cursor: 'pointer'}}>Supprimer l'image actuelle</small>}
		</>
	);
};

export default InputFileBrowser;