import axios from "axios";

function findAll() {
    return axios
        .get("/api/invoices")
        .then(response => response.data['hydra:member'])
}

function deleteInvoice(id) {
    return axios.delete("/api/invoices/" + id)
}

function find(id) {
    return axios
        .get("/api/invoices/" + id)
        .then((response) => response.data);
}

function update(id, invoice) {
    return axios.put("/api/invoices/" + id, {
        ...invoice,
        amount: Number(invoice.amount),
        customer: `/api/customers/${invoice.customer}`,
    });
}

function create(invoice) {
    return axios.post("/api/invoices", {
        ...invoice,
        amount: Number(invoice.amount),
        customer: `/api/customers/${invoice.customer}`,
    });
}

export default {
    findAll,
    find,
    create,
    update,
    delete: deleteInvoice
}
