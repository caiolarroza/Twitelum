import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home/Home';
import LoginPage from './pages/LoginPage';

import Page404 from './pages/Page404/Page404';
/* const Page404 = () => {
    return (
        <div>Você caiu na página 404 vacila1</div>
    )
} */

class PrivateRoute extends Component {
    render() {
        //console.log("asd ", this.props);
        //o react nao entende o this.props.component direto, tem que adicionar em uma const com o nome certinho
        //tem que retornar o <Route para ter acesso ao history e tudo mais
        if(localStorage.getItem('TOKEN')) {
            const ComponentQueVainaTela = this.props.component;
            return (
                <Route component={ ComponentQueVainaTela } />
            )
        } else {
            return (
                <Redirect to="/login" />
            )
        }
    }
}

const LogoutPage = () => {
    localStorage.removeItem('TOKEN')
    return <Redirect to="/login" />
}

export default class Routes extends Component {
    render() {
        return (
            <Switch>
                <PrivateRoute path="/" exact component={ Home } />
                <Route path="/login" component={ LoginPage } />
                <Route path="/logout" component={ LogoutPage } />
                <Route component={ Page404 } />
            </Switch>
        )
    }
}