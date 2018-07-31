import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'

import range from 'lodash.range'
import classnames from 'classnames'

import nfToken from '@/contracts/nfTokenFactory'

import { addTokenAction } from '@/redux/actions'

import TokenType from '../token-type'
import Ether from '@/components/ether'

import nfTokenTypeImageUrl from '@/services/nfToken-type-image-url'

import style from './style.scss'

const MyCustomComponent = class extends Component {

  render() {
    return (
      <span>
        {this.props.children}
      </span>
    )
  }

}


const CustomizeToken = class extends Component {
  constructor (props) {
    super(props)

    const random = Math.random() >= 0.5 ? {
      tokenType: 0,
      title: 'Stop smoking myself',
      price: '1.25'
    } : {
      tokenType: 1,
      title: 'Deliberate child from slavery in Africa',
      price: '2.99'
    }

    const verifier = window.web3.eth.defaultAccount

    this.state = {
      verifier: verifier,
      price: random.price,
      tokenType: random.tokenType,
      title: random.title,
      titleError: '',
      errorMessage: '',
      redirectToTokenList: false
    }
  }

  async onClickSave () {
    this.setState({ titleError: '' })

    if (this.state.title.length < 1) {
      this.setState({ titleError: 'Please enter at least 1 character for the title' })
    } else {
      try {
        let contractInstance = await nfToken(window.web3);

        const txHash = await contractInstance.create.sendTransaction(
          this.state.title,
          this.state.tokenType,
          this.state.price,
          this.state.verifier,
          { value: this.state.price }
        )

        this.props.addToken({ transactionHash: txHash })
        this.setState({ redirectToTokenList: true })
        toastr.success('Success', 'The transaction has been broadcast.')
      } catch(err) {
        toastr.error('Error', 'The transaction was cancelled or rejected.')
      }
    }
  }

  onClickTokenType (index) {
    this.setState({ tokenType: index })
  }

  render () {
    if (this.state.redirectToTokenList)
      return <Redirect to={'/challenges/all'} />

    if (this.state.titleError)
      var titleError =
        <p className="help is-danger">{this.state.titleError}</p>

    if (this.state.errorMessage)
      var errorMessage = <p className='help is-danger'>{this.state.errorMessage}</p>

    return (
      <section className='section'>
        <div className='container'>
          <div className='columns'>
            <div className='column is-one-half-desktop'>

              <div className="template">
                <div className="template-form--wrapper">
                  <div className="columns is-mobile">
                    {range(2).map(index => {
                      var selected = this.state.tokenType === index
                      return (
                        <div key={index} className="column rotate-in-center is-one-fifth-mobile is-one-fifth-tablet is-one-fifth-desktop">
                          <TokenType
                            url={nfTokenTypeImageUrl(index, 'small')}
                            onClick={() => this.onClickTokenType(index)}
                            selected={selected} />
                        </div>
                      )
                    })}
                  </div>

                  <div className="field">
                    <label className="label">What do you want to happen?</label>
                    <div className="control">
                      <input
                        placeholder={`What do you want to happen?`}
                        className="input"
                        value={this.state.title}
                        onChange={(e) => this.setState({ title: e.target.value })} />
                    </div>
                    {titleError}
                  </div>

                  <div className="field">
                    <label className="label">How much are you ready to pay for this?</label>
                    <div className="control">
                      <input placeholder={`How much are you ready to pay for this?`} className="input" value={this.state.price}
                             onChange={(e) => this.setState({ price: e.target.value })} />
                      <Ether wei={this.state.price} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Oracle (Members/Smart contract/Social consensus)</label>
                    <div className="control">
                      <input placeholer={`Members/Smart contract/Social consensus`} className="input" value={this.state.verifier}
                             onChange={(e) => this.setState({ verifier: e.target.value })} />
                    </div>
                  </div>

                  <br />
                  <p>
                    <button
                      disabled={this.state.selectedToken === null}
                      className={classnames('button is-success is-medium')}
                      onClick={(e) => this.onClickSave()}>
                      Create challenge
                    </button>
                  </p>
                  {errorMessage}
                </div>
              </div>
            </div>

            <div className='column is-one-third'>
              <figure className="image is-square">
                <img src={nfTokenTypeImageUrl(this.state.tokenType)} />
              </figure>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToken: (token) => {
      dispatch(addTokenAction(token))
    }
  }
}

export default connect(null, mapDispatchToProps)(CustomizeToken)
