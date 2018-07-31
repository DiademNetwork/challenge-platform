import React, {
  Component
} from 'react'
import { Link } from 'react-router-dom'

import Hero from '@/components/hero'

export default class Landing extends Component {

  render () {
    return (
      <Hero>
        <div className="columns">
          <div className="column"></div>

          <div className="column is-two-thirds">
            <p className="title">
              How does it works?
            </p>
            <p>
              <p>Any challenge(talent/action/decision) can be as expressed as Non-Fungible Token</p>
              <p>Every token has single owner, the person who has accepted the challenge</p>
              <p>The community can watch on the progress checking the proofs published in social networks</p>
              <p>Any member can confirm that person has done the challenge and requirements are satisfied</p>
              <p>Any sponsor can reserve funds that will be available for withdrawn when challenge will receive confirmation from trusted member</p>
              <p>The person receive motivation from community and guaranteed rewards for execution of challenge</p>
              <p>The sponsors receives personal token of person and gain profit from his growth and success</p>
            </p>

            <br />
            <Link to="/challenges/new" className="button is-info is-large">
              <span>Challenge your life NOW</span>
            </Link>
          </div>

          <div className="column"></div>
        </div>
      </Hero>
    )
  }

}
