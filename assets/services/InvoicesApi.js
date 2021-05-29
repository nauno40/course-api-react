import axios from "axios";

function findAll() {
    return axios
        .get("/api/invoices")
        .then(response => response.data['hydra:member'])
}

function deleteInvoice(id) {
    return axios.delete("/api/invoices/" + id)
}

export default {
    findAll,
    delete: deleteInvoice
}
