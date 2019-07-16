import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import App from './src/components/app'

const styles = {
  app: {
    paddingTop: 40,
    textAlign: 'center',
  },
}

class Aem extends Component {
  render() {
    return (
      <div>
        <App />
      </div>
    )
  }
}

const root = document.querySelector('#app')
ReactDOM.render(<Aem />, root)
