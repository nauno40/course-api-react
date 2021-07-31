import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import CustomersApi from "../services/CustomersApi";
import FormContentLoader from "../components/loaders/FormContentLoader";

const CustomerPage = ({ match, history }) => {
	const { id = "new" } = match.params;
	const [loading, setLoading] = useState(false);
	const [customer, setCustomer] = useState({
		lastName: "",
		firstName: "",
		email: "",
		company: "",
	});

	const [errors, setErrors] = useState({
		lastName: "",
		firstName: "",
		email: "",
		company: "",
	});

	const [editing, setEditing] = useState(false);

	const fetchCustomer = async (id) => {
		const { firstName, lastName, email, company } = await CustomersApi.find(id);
		setCustomer({ firstName, lastName, email, company });
		setLoading(false);
	};

	useEffect(() => {
		if (id !== "new") {
			setEditing(true);
			setLoading(true);
			try {
				const data = fetchCustomer(id);
			} catch (error) {
				toast.error("Le cient n'as pas pu être chargé");
			}
		}
	}, [id]);

	const handleChange = ({ currentTarget }) => {
		const { value, name } = currentTarget;
		setCustomer({ ...customer, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			setErrors({});
			if (editing) {
				const response = await CustomersApi.update(id, customer);
				toast.success("Le client à bien été modifié");
			} else {
				const response = await CustomersApi.create(customer);
				toast.error("Le client à bien été créé");
				history.replace("/customers");
			}
		} catch ({ response }) {
			const { violations } = response.data;
			if (violations) {
				const apiErrors = {};
				violations.forEach(({ propertyPath, message }) => {
					apiErrors[propertyPath] = message;
				});
				setErrors(apiErrors);
				toast.error("Des erreurs dans votre formulaire");
			}
		}
	};

	return (
		<>
			{(!editing && <h1>Création d'un Customer</h1>) || (
				<h1>Modification du client</h1>
			)}
			{loading && <FormContentLoader />}

			{!loading && (
				<form onSubmit={handleSubmit}>
					<Field
						name="lastName"
						label="Nom de famille"
						placeholder="Nom du famille du client"
						value={customer.lastName}
						onChange={handleChange}
						error={errors.lastName}
					/>
					<Field
						name="firstName"
						label="Prénom"
						placeholder="Prénom du client"
						value={customer.firstName}
						onChange={handleChange}
						error={errors.firstName}
					/>
					<Field
						name="email"
						label="Email"
						placeholder="Email du client"
						value={customer.email}
						onChange={handleChange}
						error={errors.email}
					/>
					<Field
						name="company"
						label="Entreprise"
						placeholder="Entreprise du client"
						value={customer.company}
						onChange={handleChange}
						error={errors.company}
					/>

					<div className="form-group">
						<button type="submit" className="btn btn-success">
							Enregistrer
						</button>
						<Link to="/customers" className="btn btn-link">
							Retour à la liste
						</Link>
					</div>
				</form>
			)}
		</>
	);
};

export default CustomerPage;
