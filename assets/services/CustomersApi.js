import axios from "axios";

function findAll() {
    return axios
        .get("/api/customers")
        .then(response => response.data['hydra:member'])
}

function deleteCustomer(id) {
    return axios.delete("/api/customers/" + id)
}

function find(id) {
    return axios
        .get("/api/customers/" + id)
        .then((response) => response.data); s
}

function update(id, customer) {
    return axios.put("/api/customers/" + id, customer);
}

function create(customer) {
    return axios.post("/api/customers", customer);
}

export default {
    findAll,
    find,
    create,
    update,
    delete: deleteCustomer
}
