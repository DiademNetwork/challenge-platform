import React, {
  Component
} from 'react'

import './footer.scss'

export default class Footer extends Component {

  render () {
    return (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              github.com/DiademNetwork/challenge-platform
              <br />team@challenge.do
            </p>
          </div>
        </div>
      </footer>
    )
  }
}
