import React, { Component } from "react";
import Layout from "../components/Layout/Layout";
import LoginScreen from "../components/LoginScreen/LoginScreen";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      route: "login",
      loggedIn: false
    };
  }

  onLogin () {
    this.setState({loggedIn: true});
  }

  render() {
    return (
      <Layout>
        {!this.state.loggedIn ? <LoginScreen /> : null}
        <p onClick={() => this.onLogin} className="z2">Hello from the App!</p>
      </Layout>
    );
  }
}
export default App;
