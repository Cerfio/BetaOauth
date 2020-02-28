import React from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      api_endpoint: "https://www.betaseries.com",
      client_id: "",
      client_secret: "",
      code: "",
      token: ""
    }
  }

  authBetaSeries = () => {
    let url = this.state.api_endpoint;
    url += "/authorize?client_id=";
    url += this.state.client_id;
    url += "&redirect_uri=http://localhost:3000";

    let beta_auth = window.open(
      url,
      "BetaSeries Auth",
      "resizable,scrollbars,status,location=yes,height=600,width=800"
    )
    var interval = setInterval(() => {
      try {
        if (beta_auth.closed) {
          clearInterval(interval)
        } else {
          let url = JSON.stringify(beta_auth.location.href)
          var regex = /[?#&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
          while (match = regex.exec(url)) {
            params[match[1]] = match[2];
          }
          if (params.code === undefined) {
            //TODO
          } else {
            this.setState({ code: params.code.substring(0, params.code.length - 1) }, () => {
              let getToken = "https://api.betaseries.com/oauth/access_token";
              getToken += "?client_id=" + this.state.client_id;
              getToken += "&client_secret=" + this.state.client_secret;
              getToken += "&redirect_uri=http://localhost:3000";
              getToken += "&code=" + this.state.code;
              console.log(getToken);
              fetch(getToken, {
                method: "POST"
              }).then(res => res.json()
                .then((data) => {
                  console.log(data)
                  this.setState({ token: data.access_token }, () => {
                    beta_auth.close()
                  })
                }))
            })
          }
        }
      } catch {
        //TODO
      }
    }, 1000)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button type="button" onClick={this.authBetaSeries}>Login</button>
        </header>
      </div>
    );
  }
}
