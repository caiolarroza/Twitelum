import { createStore } from 'redux';

const stateInicial = [];

function tweetsReducer(stateDentroDaStore = stateInicial, acaoDisparadaPeloDev) {
    if(acaoDisparadaPeloDev.type === 'CARREGA_TWEETS') {
        console.log('Tentando carregar tweets')
        return acaoDisparadaPeloDev.tweets
    }
    return stateDentroDaStore;
}
window.store = createStore(tweetsReducer)