import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const stateInicial = [];

function tweetsReducer(stateDentroDaStore = stateInicial, acaoDisparadaPeloDev) {
    console.log("stateDentroDaStore ", stateDentroDaStore)
    console.log("stateInicial ", stateInicial)
    if(acaoDisparadaPeloDev.type === 'CARREGA_TWEETS') {
        console.log('Tentando carregar tweets')
        return acaoDisparadaPeloDev.tweets
    }

    if(acaoDisparadaPeloDev.type === 'ADD_TWEET') {
        console.log(acaoDisparadaPeloDev);
        const tweetsAntigos = stateDentroDaStore;
        const tweetNovo = acaoDisparadaPeloDev.tweet;

        return [tweetNovo, ...tweetsAntigos];
    }

    if(acaoDisparadaPeloDev.type === 'REMOVE_TWEET') {
        /*console.log("acaoDisparadaPeloDev ", acaoDisparadaPeloDev)
        console.log("stateDentroDaStore ", stateDentroDaStore)
        const index = stateDentroDaStore.indexOf(acaoDisparadaPeloDev.tweet); meu daria certo se fosse find ao inves de filter
        console.log("index", index)
        const teste = stateDentroDaStore.splice(index, 1); meu
        console.log("teste ", teste)
        return teste*/
        const idDoTweetQueVaiSumir = acaoDisparadaPeloDev.idDoTweetQueVaiSumir
        const listaAtualizadaDeTweets = stateDentroDaStore.filter((tweetAtual) =>{
            return tweetAtual._id !== idDoTweetQueVaiSumir
        })

        return listaAtualizadaDeTweets
    }

    return stateDentroDaStore;
}

export default createStore(tweetsReducer, 
    applyMiddleware(thunk)
)