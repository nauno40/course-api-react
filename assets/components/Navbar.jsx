import React from "react";
import { NavLink } from "react-router-dom";
import AuthApi from "../services/AuthApi";

const Navbar = ({ isAuthenticated, onLogout, history }) => {
	const handleLogout = () => {
		AuthApi.logout();
		onLogout(false);
		history.push("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
			<div className="container-fluid">
				<NavLink className="navbar-brand" to="#">
					Navbar
				</NavLink>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarColor03"
					aria-controls="navbarColor03"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>

				<div className="collapse navbar-collapse" id="navbarColor03">
					<ul className="navbar-nav ml-auto">
						<li className="nav-item">
							<NavLink className="nav-link" to="/home">
								Home
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/customers">
								Customers
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/invoices">
								Invoices
							</NavLink>
						</li>
					</ul>
					<ul className="navbar-nav mr-auto col-4">
						{(!isAuthenticated && (
							<>
								<li className="nav-item">
									<NavLink className="nav-link" to="/register">
										Insription
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink className="btn btn-success" to="/login">
										Connexion
									</NavLink>
								</li>
							</>
						)) || (
							<>
								<li className="nav-item">
									<button className="btn btn-danger" onClick={handleLogout}>
										Déconnexion
									</button>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
