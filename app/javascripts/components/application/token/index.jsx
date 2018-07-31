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
      type: null
    }

    this.onClickClaimReward = this.onClickClaimReward.bind(this)
    this.onClickAddReward = this.onClickAddReward.bind(this)
    this.onClickConfirm = this.onClickConfirm.bind(this)
    this.onClickAccept = this.onClickAccept.bind(this)
  }

  tokenId () {
    return this.props.match.params.tokenId
  }

  amount () {
    return 1
  }

  verifier() {
    return '0xa6279ef0c0c4bea836e7e22acc445f74bea33cbd'
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
          title: values[1]
        })
      }
    })
  }

  async onClickClaimReward() {
    try {
      let contractInstance = await nfToken(window.web3)

      const txHash = await contractInstance.claimReward.sendTransaction(this.tokenId(), this.verifier())

      toastr.success('Success', `Funds from ${this.verifier()} was transferred`)
    } catch (err) {
      toastr.error('Error', err)
    }
  }

  async onClickAddReward() {
    try {
      let contractInstance = await nfToken(window.web3)

      const txHash = await contractInstance.addReward.sendTransaction(this.tokenId(), this.amount(), this.verifier())

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

  async onClickAccept() {
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
              Reward: {this.state.price}
              <button
                className={classnames('button is-success is-medium')}
                onClick={(e) => this.onClickClaimReward()}>
                Claim reward
              </button>
              <button
                className={classnames('button is-success is-medium')}
                onClick={(e) => this.onClickAddReward()}>
                Add reward
              </button>
              <button
                className={classnames('button is-success is-medium')}
                onClick={(e) => this.onClickConfirm()}>
                Confirm execution
              </button>
              <button
                className={classnames('button is-success is-medium')}
                onClick={(e) => this.onClickAccept()}>
                Accept challenge
              </button>
            </p>

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
