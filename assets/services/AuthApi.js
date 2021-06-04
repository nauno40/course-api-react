import axios from "axios";
import jwtDecode from "jwt-decode";

let token;

async function authenticate(credentials) {
    const response = await axios.post("/api/login_check", credentials);
    const token = response.data.token;

    window.localStorage.setItem("authToken", token);
    setAxiosToken(token)

    return true;
}

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setUp() {
    const token = window.localStorage.getItem("authToken");

    if (token) {
        const { exp: expiration } = jwtDecode(token);

        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token)
        } else {
            logout();
        }
    } else {
        logout();
    }
}

function isAuthenticated() {
    if (token) {
        const { exp: expiration } = jwtDecode(token);

        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setUp,
    isAuthenticated
}