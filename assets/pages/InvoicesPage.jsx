import React, {useEffect, useState} from "react";
import Pagination from "../components/Pagination";
import moment from "moment";
import InvoicesApi from "../services/InvoicesApi";

const STATUS_CLASSES = {
    PAID: 'success',
    SENT: 'info',
    CANCELLED: 'danger'
}

const STATUS_LABELS = {
    PAID: 'Payée',
    SENT: 'Envoyée',
    CANCELLED: 'Annulée'
}

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 25;

    const fetchInvoices = async () => {
        try {
            const data = await InvoicesApi.findAll();
            setInvoices(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        fetchInvoices();
    }, [])

    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoices => invoices.id !== id));

        try {
            await InvoicesApi.delete(id);
        } catch (error) {
            setInvoices(originalInvoices);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    const filteredInvoices = invoices.filter(
        i =>
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
            <h1>Liste des Factures</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"
                       placeholder="Rechercher ..."/>
            </div>

            <table className='table table-hover'>
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
                <tbody>
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <th className="text-center">{invoice.chrono}</th>
                        <th className="text-center">
                            <a href='#'>{invoice.customer.firstName} {invoice.customer.lastName}</a>
                        </th>
                        <th className="text-center">{formatDate(invoice.sentAt)}</th>
                        <th className="text-center">
                            <span className={"badge bg-" + STATUS_CLASSES[invoice.status]}>
                                {STATUS_LABELS[invoice.status]}
                            </span>
                        </th>
                        <th className="text-center">{invoice.amount.toLocaleString()} €</th>
                        <th>
                            <button className="btn btn-sm btn-primary mr-1">Editer</button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(invoice.id)}>Supprimer
                            </button>
                        </th>
                    </tr>
                )}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChanged={handlePageChange}
                length={filteredInvoices.length}/>
        </>
    );
};

export default InvoicesPage;
