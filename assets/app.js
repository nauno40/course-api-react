import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import './bootstrap';
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import CustomersPage from "./pages/CustomersPage";
import CustomerPage from "./pages/CustomerPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AuthApi from "./services/AuthApi";
import AuthContext from "./contexts/AuthContext";
import './styles/app.css';


AuthApi.setUp();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthApi.isAuthenticated());
    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <HashRouter>
                <NavbarWithRouter />

                <main className="container pt-5">
                    <Switch>
                        <Route path={"/login"} component={LoginPage} />
                        <Route path={"/register"} component={RegisterPage} />
                        <PrivateRoute path="/customers/:id" component={CustomerPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <PrivateRoute path="/invoices/:id" component={InvoicePage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <Route path={"/"} component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    )
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
