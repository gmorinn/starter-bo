const Err = res => {
	if (res?.err) {
		switch (true) {
			case res.err.includes("no rows in result set"):
				return "Email or password incorrect"
			case res.err.includes("EMAIL_ALREADY_EXIST"):
				return "Email already exist."
			case res.err.includes("unique_violation"):
				return "The data entered is already in use."
			case res.err.includes("BAD_ROLE"):
				return "You are not allowed to do this."
			default:
				break;
		}
	}

	if (res?.error_code) {
		switch (true) {
			case res.err.includes("BAD_ROLE"):
				return "You are not allowed to do this."
			default:
				break;
		}
	}

	if (res?.message) {
		switch (true) {
			// eslint-disable-next-line
			case res.message.includes(`must match the regexp \"\\\\d\"`):
				return "Password must contain at least one number."
			case res.message.includes(`Wrong format`):
				return "This format is not allowed."
			default:
				break;
		}
	}

	if (res?.name) {
		switch (true) {
			// eslint-disable-next-line
			case res.name.includes(`missing_field`):
				return "Please fill the required fields."
			default:
				break;
		}
	}

	return "An error has occurred."
}

export default Err