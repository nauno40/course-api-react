import axios from "axios";
import Cache from "./Cache";

async function findAll() {
    const cachedCustomers = await Cache.get("customers");

    if (cachedCustomers) return cachedCustomers;

    return axios.get("/api/customers").then((response) => {
        const customers = response.data["hydra:member"];
        Cache.set("customers", customers);
        return customers;
    });
}

function deleteCustomer(id) {
    return axios.delete("/api/customers/" + id).then(async (response) => {
        const cachedCustomers = await Cache.get("customers");
        if (cachedCustomers) {
            const customers = cachedCustomers.filter(
                (customer) => customer.id !== id
            );
        }

        return response;
    });
}

async function find(id) {
    const cachedCustomer = await Cache.get("customer." + id);

    if (cachedCustomer) return cachedCustomer;
    return axios.get("/api/customers/" + id).then((response) => {
        const customer = response.data;
        Cache.set("customer." + id, customer);

        return customer;
    });
}

function update(id, customer) {
    return axios.put("/api/customers/" + id, customer).then((response) => {
        Cache.invalidate("customers");
        return response;
    });
}

function create(customer) {
    return axios.post("/api/customers", customer).then(async (response) => {
        const cachedCustomers = await Cache.get("customers");
        if (cachedCustomers) {
            const customers = [...cachedCustomers, response.data];
        }

        return response;
    });
}

export default {
    findAll,
    find,
    create,
    update,
    delete: deleteCustomer,
};
