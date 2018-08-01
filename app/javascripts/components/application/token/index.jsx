import React, {
  Component
} from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import _ from 'lodash';
import PropTypes from 'prop-types'
import { BigNumber } from 'bignumber.js';

import Address from '@/components/address'
import EtherscanButton from '@/components/EtherscanButton'

import nfTokenTypeImageUrl from '@/services/nfToken-type-image-url'
import getToken from '@/services/get-token'

import classnames from 'classnames'

import nfToken from '@/contracts/nfTokenFactory'

import { toastr } from 'react-redux-toastr'

require('./style.scss')

const Token = class extends Component {

  constructor (props) {
    super(props)
    this.state = {
      type: null,
      claimRewardVerifier: '',
      addRewardVerifier: '',
      addRewardValue: ''
    }

    this.onClickClaimReward = this.onClickClaimReward.bind(this)
    this.onClickAddReward = this.onClickAddReward.bind(this)
    this.onClickConfirm = this.onClickConfirm.bind(this)
    this.onClickAcceptChallenge = this.onClickAcceptChallenge.bind(this)
  }

  tokenId () {
    return this.props.match.params.tokenId
  }

  componentDidMount() {
    this._isMounted = true;

    this.getTokenFromBlockchain();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getTokenFromBlockchain() {
    getToken(this.tokenId(), window.web3).then((values) => {
      if (this._isMounted) {
        this.setState({
          type: values[0],
          title: values[1],
          price: values[2],
          verifiers: values[3]
        })
      }
    })
  }

  async onClickClaimReward() {
    try {
      let contractInstance = await nfToken(window.web3)

      const txHash = await contractInstance.claimReward.sendTransaction(this.tokenId(), this.state.claimRewardVerifier)

      toastr.success('Success', `Your reward was withdrawn!`)
    } catch (err) {
      toastr.error('Error', err)
    }
  }

  async onClickAddReward() {
    try {
      let contractInstance = await nfToken(window.web3)

      const txHash = await contractInstance.addReward.sendTransaction(this.tokenId(), this.state.addRewardValue, this.state.addRewardVerifier,
        { value: this.state.addRewardValue })

      toastr.success('Success', `Reward for ${this.tokenId()} added`)
    } catch (err) {
      toastr.error('Error', err)
    }
  }

  async onClickConfirm() {
    try {
      let contractInstance = await nfToken(window.web3)

      const txHash = await contractInstance.confirm.sendTransaction(this.tokenId())

      toastr.success('Success', `You confirmed that owner of ${this.tokenId()} has completed mission`)
    } catch (err) {
      toastr.error('Error', err)
    }
  }

  async onClickAcceptChallenge() {
    try {
      let contractInstance = await nfToken(window.web3)

      const txHash = await contractInstance.acceptChallenge.sendTransaction(this.tokenId())

      toastr.success('Success', `You accepted challenge ${this.tokenId()}`)
    } catch (err) {
      toastr.error('Error', err)
    }
  }

  render () {
    var content
    if (this.state.type !== null) {
      var address = 'no-address';
      if (typeof this.props.token.transactionHash !== 'undefined')
        address = this.props.token.transactionHash

      content = (
        <div className="token columns is-centered">
          <div className='column is-three-quarters-tablet is-three-quarters-desktop is-one-half-widescreen is-one-half-fullhd has-text-centered'>
            <figure
              className="token__image">
              <img src={nfTokenTypeImageUrl(this.state.type)} />
            </figure>

            <p className="token__title title has-text-grey">
              {this.state.title}
            </p>
            <p>
              Total reward: {this.state.price} WEI
            </p>

            <div className="field is-grouped is-grouped-centered">
                <div className="control is-narrow">
                  <div className="select">
                    <select value={this.claimRewardVerifier} defaultValue={this.state.verifiers[0]} onChange={(e) => this.setState({ claimRewardVerifier: e.target.value })}>
                      {this.state.verifiers.map((verifier, i) => {
                        return (<option key={i}>{verifier}</option>)
                      })}
                    </select>
                  </div>
                </div>
                <p className="control">
                  <button className={classnames('button is-success is-medium')} onClick={this.onClickClaimReward}>
                    Claim reward
                  </button>
                </p>
            </div>

            <div className="field is-grouped is-grouped-centered">
                <p className="control">
                  <input className="input" type="text" placeholder="Verifier address" value={this.state.addRewardVerifier}
                         onChange={(e) => this.setState({ addRewardVerifier: e.target.value })} />
                </p>
                <p className="control">
                  <input className="input" type="text" placeholder="Value" value={this.state.addRewardValue}
                         onChange={(e) => this.setState({ addRewardValue: e.target.value })} />
                </p>
                <button className={classnames('button is-success is-medium')} onClick={this.onClickAddReward}>
                  Add reward
                </button>
            </div>

            <div className="field">
              <button className={classnames('button is-success is-medium')} onClick={this.onClickAcceptChallenge}>
                Accept challenge
              </button>
            </div>

            <div className="field">
              <button className={classnames('button is-success is-medium')} onClick={this.onClickConfirm}>
                Confirm execution
              </button>
            </div>

            <table className='table is-striped is-fullwidth'>
              <thead>
                <tr>
                  <th>
                    TokenID
                  </th>
                  <th width="80%">
                    Transaction Hash
                  </th>
                  <th>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {this.tokenId()}
                  </td>
                  <td>
                    <Address address={address} toggleFull={true} />
                  </td>
                  <td>
                    <EtherscanButton txHash={address} linkText='View on Etherscan' />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    return (
      <section className='section'>
        <div className='container'>
          {content}
        </div>
      </section>
    )
  }
}

Token.propTypes = {
  match: PropTypes.object.isRequired
}

Token.defaultProps = {
  token: PropTypes.object
}

const mapStateToProps = function(state, props) {
  let token = {}

  if (state.tokens.length > 0) {
    let tokenIdAsBigNumber = new BigNumber(props.match.params.tokenId)
    token = _.find(state.tokens, { args: { tokenId: tokenIdAsBigNumber } })
  }

  return {
    token: token
  }
}

export default connect(mapStateToProps)(Token);
