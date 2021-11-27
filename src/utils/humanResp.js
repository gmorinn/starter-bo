const Err = res => {
	if (res?.err) {
		if (res.err.includes("no rows in result set")) {
			return "Email or password incorrect"
		}
		if (res.err.includes("EMAIL_ALREADY_EXIST")) {
			return "Email already exist."
		}
		if (res.err.includes("unique_violation")) {
			return "The data entered is already in use."
		}
	}

	if (res?.error_code) {
		if (res.error_code.includes("BAD_ROLE")) {
			return "You are not allowed to do this."
		}
	}

	if (res?.message) {
		// eslint-disable-next-line
		if (res.message.includes(`must match the regexp \"\\\\d\"`)) {
			return "Password must contain at least one number."
		}
	}

	else return "An error has occurred."
}

export default Err