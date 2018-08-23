import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../containers/TweetContainer'
import Helmet from 'react-helmet'
import Modal from '../../components/Modal/Modal'
import PropTypes from 'prop-types'
import * as TweetsActions from '../../actions/TweetsActions'

class Home extends Component {
    constructor() {
        super();

        this.state = {
            novoTweet: '',
            tweets: [],
            tweetAtivo: {}
        }
        
        //o local certo para fazer isso é no route
        /* if(!localStorage.getItem('TOKEN')) {
            props.history.push('/login')
        }*/

    }

    static contextTypes = {
        store: PropTypes.object
    }

    componentDidMount() {
        this.context.store.subscribe(() => {
            this.setState({
                tweets: this.context.store.getState().tweets,
                tweetAtivo: this.context.store.getState().tweetAtivo
                
            })
        })
        this.context.store.dispatch(TweetsActions.carregaTweets());
    }

    adicionaTweet = (event) => { //stage 3 do TC39
        event.preventDefault();
        //valida o conteudo
        if(this.state.novoTweet) {
            //TweetsActions.adicionaTweet(this.state.novoTweet)(this.context.store.dispatch) -> poderia ser assim a linha de baixo
            this.context
                .store.dispatch(TweetsActions.adicionaTweet(this.state.novoTweet))
            
            this.setState({
                novoTweet: ''
            })
        }
    }

    //saiu daqui e foi para o Tweet e depois tiramos do Tweet e colocamos no TweetContainer
    /*removeOTweet = (idDoTweet) => {
        
        //o que estava funcionando por ultimo
        // this.context.store.dispatch(TweetsActions.removeTweet(idDoTweet))

        //meu -- errado pq usei filter inves de find
        //this.context.store.dispatch(TweetsActions.removeTweet(this.state.tweets, idDoTweet))

        //old foi a primeira versão, sem redux
            const listaAtualizada = this.state.tweets.filter((tweetAtual) => {
                    return tweetAtual._id !== idDoTweet
            })

        //esse cara ta aqui só pra mostrar que dava pra fazer também direto na store
        //    fetch(`http://twitelum-api.herokuapp.com/tweets/${idDoTweet}?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
        //        method: 'DELETE',
        //        body: JSON.stringify({ conteudo: this.state.novoTweet })
        //    })
        //    .then( (resposta) => resposta.json())
        //    .then( (respostaConvertidaEmObjeto) => {
        //        this.context
        //        .store.dispatch({ type: 'REMOVE_TWEET', idDoTweetQueVaiSumir: idDoTweet })
        //    })

    }*/

    abreModal = (idDoTweetQueVaiNoModal) => {
        //codigo antigo antes de passar tudo pra store
            /*const tweetQueVaiFicarAtivo = this.state.tweets.find((tweetAtual) => {
                return tweetAtual._id === idDoTweetQueVaiNoModal
            })
            this.setState({
                tweetAtivo: tweetQueVaiFicarAtivo
            })*/

        this.context.store.dispatch({ 
            type: 'ABRE_MODAL', 
            idDoTweetQueVaiNoModal: idDoTweetQueVaiNoModal
        })
    }

    fechaModal = () => {
        this.setState({
            tweetAtivo: {}
        })
    }

    closeModal = (event) => {
        const elementoAlvo = event.target;
        const ehModal = elementoAlvo.classList.contains('modal');

        if(ehModal) {
            this.context.store.dispatch({type: 'FECHA_MODAL' })
        }

    }

    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Twitelum Tweets - ({ `${ this.state.tweets.length }`})</title>
                </Helmet>
                <Cabecalho>
                    <NavMenu usuario="@caiolarroza" />
                </Cabecalho>
                <div className="container">
                    <Dashboard>
                        <Widget>
                            <form className="novoTweet" onSubmit={ this.adicionaTweet }>
                                <div className="novoTweet__editorArea">
                                    <span className={ `novoTweet__status ${
                                        this.state.novoTweet.length > 140
                                        ? 'novoTweet__status--invalido'
                                        : ''
                                    }` }>
                                        { this.state.novoTweet.length }/140
                                    </span>
                                    <textarea
                                        onChange={ (event) => {
                                            this.setState( {
                                                novoTweet: event.target.value 
                                            } ) 
                                        } }
                                        value={ this.state.novoTweet }
                                        className="novoTweet__editor" 
                                        placeholder="O que está acontecendo?"
                                    ></textarea>
                                </div>
                                <button
                                    disabled={ this.state.novoTweet.length > 140 }
                                    type="submit" 
                                    className="novoTweet__envia"
                                >Tweetar</button>
                            </form>
                        </Widget>
                        <Widget>
                            <TrendsArea />
                        </Widget>
                    </Dashboard>
                    <Dashboard posicao="centro">
                        <Widget>
                            <div className="tweetsArea">
                                {
                                    this.state.tweets.length > 0
                                    ?this.state.tweets.map((tweetAtual, indice) => {
                                        return <Tweet 
                                                key={tweetAtual._id}
                                                removivel={tweetAtual.removivel} 
                                                texto={tweetAtual.conteudo}
                                                usuario={tweetAtual.usuario}
                                                totalLikes={tweetAtual.totalLikes}
                                                likeado={tweetAtual.likeado}
                                                id={tweetAtual._id}
                                                abreModalHandler={() => {
                                                    this.abreModal(tweetAtual._id)
                                                }}/>
                                    })
                                    :  "carregando"
                                }
                            </div>
                        </Widget>
                    </Dashboard>
                </div>

                <Modal isAberto={ Boolean(this.state.tweetAtivo._id)}
                       closeModal={this.closeModal }>
                    {
                        Boolean(this.state.tweetAtivo._id) &&
                        <Widget>
                            <Tweet 
                                id={ this.state.tweetAtivo._id }
                                texto={ this.state.tweetAtivo.conteudo }
                                usuario={ this.state.tweetAtivo.usuario }
                                isModal={ true }
                                fechaModalHandler={() => {
                                    this.fechaModal()
                                }}
                                totalLikes={this.state.tweetAtivo.totalLikes}
                                likeado={this.state.tweetAtivo.likeado}
                                removivel={ this.state.tweetAtivo.removivel }
                                />
                        </Widget>
                    }
                </Modal>

            </Fragment>
        );
    }
}

export default Home;
