import React, { useState } from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage"
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import './styles/app.css';
import './bootstrap';
import LoginPage from "./pages/LoginPage";
import AuthApi from "./services/AuthApi";

AuthApi.setUp();

const PrivateRoute = ({ path, isAuthenticated, component }) => {
    return isAuthenticated ? <Route path={path} component={component} /> : <Redirect to="/login" />;
}

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthApi.isAuthenticated());

    const NavbarWithRouter = withRouter(Navbar);

    return (
        <HashRouter>
            <NavbarWithRouter isAuthenticated={isAuthenticated} onLogout={setIsAuthenticated} />

            <main className="container pt-5">
                <Switch>
                    <Route path={"/login"} render={props => <LoginPage onLogin={setIsAuthenticated} {...props} />} />
                    <PrivateRoute path="/customers" isAuthenticated={isAuthenticated} component={CustomersPage} />
                    <PrivateRoute path="/invoices" isAuthenticated={isAuthenticated} component={InvoicesPage} />
                    <Route path={"/"} component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    )
}
const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
