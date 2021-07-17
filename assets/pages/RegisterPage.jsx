import React, { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import UsersApi from "../services/UsersApi";
import axios from "axios";

const RegisterPage = ({ history }) => {
	const [user, setUser] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordConfirm: "",
	});

	const [errors, setErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordConfirm: "",
	});

	const handleChange = ({ currentTarget }) => {
		const { name, value } = currentTarget;
		setUser({ ...user, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const apiErrors = {};
		if (user.password !== user.passwordConfirm) {
			apiErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
			setErrors(apiErrors);
			return;
		}

		try {
			const response = await UsersApi.register(user);
			setErrors({});
			history.replace(`/login`);
		} catch ({ response }) {
			const { violations } = response.data;
			if (violations) {
				violations.forEach(({ propertyPath, message }) => {
					apiErrors[propertyPath] = message;
				});
				setErrors(apiErrors);
			}
		}
	};

	return (
		<>
			<h1>Inscription</h1>
			<form onSubmit={handleSubmit}>
				<Field
					name="firstName"
					label="Prénom"
					placeholder="Votre prénom"
					onChange={handleChange}
					value={user.firstName}
					error={errors.firstName}
				/>
				<Field
					name="lastName"
					label="Nom"
					placeholder="Votre nom de Famille"
					onChange={handleChange}
					value={user.lastName}
					error={errors.lastName}
				/>
				<Field
					name="email"
					label="Email"
					placeholder="Votre email"
					type="email"
					onChange={handleChange}
					value={user.email}
					error={errors.email}
				/>
				<Field
					name="password"
					label="Mot de passe"
					placeholder="Votre mot de passe"
					type="password"
					onChange={handleChange}
					value={user.password}
					error={errors.password}
				/>
				<Field
					name="passwordConfirm"
					label="Confirmation de mot de passe"
					placeholder="Confirmer votre mot de passe"
					type="password"
					onChange={handleChange}
					value={user.passwordConfirm}
					error={errors.passwordConfirm}
				/>

				<div className="form-group">
					<button type="submit" className="btn btn-success">
						Confirmation
					</button>
					<Link to="/login" className="btn btn-link">
						J'ai déjà un compte
					</Link>
				</div>
			</form>
		</>
	);
};

export default RegisterPage;
