import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'
import Helmet from 'react-helmet'

class Home extends Component {
    constructor() {
        super();
        this.state = {
            novoTweet: '',
            tweets: []
        }
        
        //o local certo para fazer isso é no route
        /* if(!localStorage.getItem('TOKEN')) {
            props.history.push('/login')
        }*/
    }

    componentDidMount() {
        fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`)
        .then( (respostaDoServidor) => respostaDoServidor.json() )
        .then( (tweetsVindosDoServidor) => {
            this.setState({
                tweets: tweetsVindosDoServidor
            })
        })
    }

    adicionaTweet = (event) => { //stage 3 do TC39
        event.preventDefault();
        //valida o conteudo
        if(this.state.novoTweet) {
            fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
                method: 'POST',
                body: JSON.stringify({ conteudo: this.state.novoTweet })
            })
            .then((respostaDoServidor) => {
                return respostaDoServidor.json()
            })
            .then((respostaConvertidaEmObjeto) => {
                this.setState({
                    tweets: [respostaConvertidaEmObjeto, ...this.state.tweets],
                    novoTweet: ''
                })
            })
        }
    }

    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Twitelum Tweets - ({ `${ this.state.tweets.length}`})</title>
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
                                    ?this.state.tweets.map(function(tweetAtual, indice) {
                                        return <Tweet 
                                                key={tweetAtual._id}
                                                removivel={tweetAtual.removivel} 
                                                texto={tweetAtual.conteudo}
                                                usuario={tweetAtual.usuario}
                                                totalLikes={tweetAtual.totalLikes}
                                                likeado={tweetAtual.likeado}
                                                id={tweetAtual._id}/>
                                    })
                                    :  "carregando"
                                }
                            </div>
                        </Widget>
                    </Dashboard>
                </div>
            </Fragment>
        );
    }
}

export default Home;
