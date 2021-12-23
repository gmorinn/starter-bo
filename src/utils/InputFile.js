import { Input } from '@mui/material';
import React from 'react';
import { useApi } from '../Hooks/useApi';

const InputFileBrowser = ({ id, limit, ...rest }) => {

	const { onChange } = { ...rest }
	const { Fetch, loading } = useApi()

	const uploadFile = async e => {
		const files = e.target.files

		const formData = new FormData()
		formData.append('file', files[0])

		if (limit) {
			let fileSize = 0
			if (files && files[0]) {
				fileSize = files[0].size
			}
			if (fileSize > limit * 1024 * 1024) {
				alert("Fichier trop lourd")
			} else {
				return Fetch(`/file/upload`, "POST", formData, false).then(res => res?.success && onChange(res.file.url))
			}
		} else {
			return Fetch(`/file/upload`, "POST", formData, false).then(res => res?.success && onChange(res.file.url))
		}

	}

	return (
		<Input disabled={loading} bsSize="lg" id={id} {...rest} onChange={uploadFile} />
	);
};

export default InputFileBrowser;