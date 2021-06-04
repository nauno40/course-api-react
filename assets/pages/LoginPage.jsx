import React, { useState, useContext } from "react";
import AuthApi from "../services/AuthApi";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({ oogin, history }) => {
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
			history.replace("/customers");
		} catch (error) {
			setError("Aucun compte ne possède cette adresse email");
		}
	};

	return (
		<>
			<h1>Connexion à l'application</h1>

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Adresse Email</label>
					<input
						value={credentials.username}
						onChange={handleChange}
						type="email"
						placeholder="Adresse Email"
						name="username"
						className={"form-control" + (error && " is-invalid")}
					/>
					{error && <p className="invalid-feedback">{error}</p>}
				</div>
				<div className="form-group">
					<label htmlFor="password">Mot de passe</label>
					<input
						value={credentials.password}
						onChange={handleChange}
						type="password"
						placeholder="Mot de passe"
						name="password"
						className="form-control"
					/>
				</div>

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
