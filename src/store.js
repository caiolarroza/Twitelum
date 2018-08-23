import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const stateInicial = { 
    tweets: [], 
    tweetAtivo: {}
};

function tweetsReducer(stateDentroDaStore = stateInicial, acaoDisparadaPeloDev) {
    if(acaoDisparadaPeloDev.type === 'CARREGA_TWEETS') {
        return {
            ...stateDentroDaStore,
            tweets: acaoDisparadaPeloDev.tweets
        }
    }

    if(acaoDisparadaPeloDev.type === 'ADD_TWEET') {
        const tweetsAntigos = stateDentroDaStore.tweets;
        const tweetNovo = acaoDisparadaPeloDev.tweet;

        return {
            ...stateDentroDaStore,
            tweets: [tweetNovo, ...tweetsAntigos]
        };
    }

    if(acaoDisparadaPeloDev.type === 'REMOVE_TWEET') {
        /*console.log("acaoDisparadaPeloDev ", acaoDisparadaPeloDev)
        const index = stateDentroDaStore.indexOf(acaoDisparadaPeloDev.tweet); meu daria certo se fosse find ao inves de filter
        console.log("index", index)
        const teste = stateDentroDaStore.splice(index, 1); meu
        console.log("teste ", teste)
        return teste*/
        const idDoTweetQueVaiSumir = acaoDisparadaPeloDev.idDoTweetQueVaiSumir
        const listaAtualizadaDeTweets = stateDentroDaStore.tweets.filter((tweetAtual) =>{
            return tweetAtual._id !== idDoTweetQueVaiSumir
        })

        return { ...stateDentroDaStore, tweets: listaAtualizadaDeTweets }
    }

    if(acaoDisparadaPeloDev.type === 'ABRE_MODAL') {
        const idDoTweetQueVaiNoModal = acaoDisparadaPeloDev.idDoTweetQueVaiNoModal
        const tweetQueVaiFicarAtivo = stateDentroDaStore.tweets.find((tweetAtual) => {
            return tweetAtual._id === idDoTweetQueVaiNoModal
        })

        return {
            ...stateDentroDaStore,
            tweetAtivo: tweetQueVaiFicarAtivo
        }
    }

    if(acaoDisparadaPeloDev.type === 'FECHA_MODAL') {
        return {
            ...stateDentroDaStore,
            tweetAtivo: {}
        }
    }
    return stateDentroDaStore;
}

export default createStore(tweetsReducer, 
    applyMiddleware(thunk)
)