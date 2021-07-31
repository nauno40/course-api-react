import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import InvoicesApi from "../services/InvoicesApi";

const STATUS_CLASSES = {
	PAID: "success",
	SENT: "info",
	CANCELLED: "danger",
};

const STATUS_LABELS = {
	PAID: "Payée",
	SENT: "Envoyée",
	CANCELLED: "Annulée",
};

const InvoicesPage = (props) => {
	const [invoices, setInvoices] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const itemsPerPage = 25;

	const fetchInvoices = async () => {
		try {
			const data = await InvoicesApi.findAll();
			setInvoices(data);
			setLoading(false);
		} catch (error) {
			toast.error("Erreur lors du chargement des factures");
		}
	};

	useEffect(() => {
		fetchInvoices();
	}, []);

	const formatDate = (str) => moment(str).format("DD/MM/YYYY");

	const handleDelete = async (id) => {
		const originalInvoices = [...invoices];
		setInvoices(invoices.filter((invoices) => invoices.id !== id));
		toast.success("La facture a été supprimé");

		try {
			await InvoicesApi.delete(id);
		} catch (error) {
			toast.error(
				"Une erreur est survenue lors de la suppression de la facture"
			);
			setInvoices(originalInvoices);
		}
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleSearch = ({ currentTarget }) => {
		setSearch(currentTarget.value);
		setCurrentPage(1);
	};

	const filteredInvoices = invoices.filter(
		(i) =>
			i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
			i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
			i.amount.toString().includes(search.toLowerCase()) ||
			i.status.toLowerCase().includes(search.toLowerCase()) ||
			STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
	);

	const paginatedInvoices = Pagination.getData(
		filteredInvoices,
		currentPage,
		itemsPerPage
	);

	return (
		<>
			<div className="d-flex justify-content-between align-items-center">
				<h1>Liste des Factures</h1>
				<Link className="btn btn-primary" to="/invoices/new">
					Créer une facture
				</Link>
			</div>

			<div className="form-group">
				<input
					type="text"
					onChange={handleSearch}
					value={search}
					className="form-control"
					placeholder="Rechercher ..."
				/>
			</div>

			<table className="table table-hover">
				<thead>
					<tr>
						<th className="text-center">Numéro</th>
						<th className="text-center">Client</th>
						<th className="text-center">Date d'envoi</th>
						<th className="text-center">Statut</th>
						<th className="text-center">Montant</th>
						<th></th>
					</tr>
				</thead>
				{!loading && (
					<tbody>
						{paginatedInvoices.map((invoice) => (
							<tr key={invoice.id}>
								<th className="text-center">{invoice.chrono}</th>
								<th className="text-center">
									<Link to={"/customers/" + invoice.customer.id}>
										{invoice.customer.firstName} {invoice.customer.lastName}
									</Link>
								</th>
								<th className="text-center">{formatDate(invoice.sentAt)}</th>
								<th className="text-center">
									<span
										className={"badge bg-" + STATUS_CLASSES[invoice.status]}
									>
										{STATUS_LABELS[invoice.status]}
									</span>
								</th>
								<th className="text-center">
									{invoice.amount.toLocaleString()} €
								</th>
								<th>
									<Link
										to={"/invoices/" + invoice.id}
										className="btn btn-sm btn-primary mr-1"
									>
										Editer
									</Link>
									<button
										className="btn btn-sm btn-danger"
										onClick={() => handleDelete(invoice.id)}
									>
										Supprimer
									</button>
								</th>
							</tr>
						))}
					</tbody>
				)}
			</table>

			{loading && <TableLoader />}

			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				onPageChanged={handlePageChange}
				length={filteredInvoices.length}
			/>
		</>
	);
};

export default InvoicesPage;
