import React, { useState, useContext } from "react";
import AuthApi from "../services/AuthApi";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import { toast } from "react-toastify";

const LoginPage = ({ history }) => {
	const { setIsAuthenticated } = useContext(AuthContext);

	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const [error, setError] = useState("");

	const handleChange = ({ currentTarget }) => {
		const { value, name } = currentTarget;
		setCredentials({ ...credentials, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await AuthApi.authenticate(credentials);
			setError("");
			setIsAuthenticated(true);
			toast.success("Vous êtes connecté");
			history.replace("/customers");
		} catch (error) {
			setError("Aucun compte ne possède cette adresse email");
			toast.error("Une erreur est survenue");
		}
	};

	return (
		<>
			<h1>Connexion à l'application</h1>

			<form onSubmit={handleSubmit}>
				<Field
					label="Adresse Email"
					name="username"
					value={credentials.username}
					placeholder="Adresse email de connexion"
					error={error}
					onChange={handleChange}
				/>

				<Field
					label="Mot de passe"
					name="password"
					value={credentials.password}
					error=""
					type="password"
					onChange={handleChange}
				/>

				<div className="form-group">
					<button type="submit" className="btn btn-success">
						Je me connecte
					</button>
				</div>
			</form>
		</>
	);
};

export default LoginPage;
