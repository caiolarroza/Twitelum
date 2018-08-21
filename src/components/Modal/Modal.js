import React, { Component } from 'react';
import './modal.css';

export default class Modal extends Component {

    render() {
        return (
            <div className={`modal ${ this.props.isAberto && 'modal--isAtivo' }`} onClick={ this.props.closeModal }>
                <div className="modal__wrap">
                    { this.props.isAberto && this.props.children }
                </div>
            </div>
        )
    }
}