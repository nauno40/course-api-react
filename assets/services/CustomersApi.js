import axios from "axios";

function findAll() {
    return axios
        .get("/api/customers")
        .then(response => response.data['hydra:member'])
}

function deleteCustomer(id) {
    return axios.delete("/api/customers/" + id)
}

export default {
    findAll,
    delete: deleteCustomer
}
