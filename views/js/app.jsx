
const AUTH_ID="admin"
const AUTH_PASSWORD="14123123"


class App extends React.Component {
  parseHash() {

    // Read JWT token from local strage. 

    // Validate whether JWT Token is available or not from server. 

    // If available JWT then go to home. 

    // Or close.


    /*
    this.auth0 = new auth0.WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID
    });
    this.auth0.parseHash(window.location.hash, (err, authResult) => {
      if (err) {
        return console.log(err);
      }
      if (
        authResult !== null &&
        authResult.accessToken !== null &&
        authResult.idToken !== null
      ) {
        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem(
          "profile",
          JSON.stringify(authResult.idTokenPayload)
        );
        window.location = window.location.href.substr(
          0,
          window.location.href.indexOf("#")
        );
      }
    });
    */
  }ww

  setup() {
    $.ajaxSetup({
      beforeSend: (r) => {
        if (localStorage.getItem("access_token")) {
          r.setRequestHeader(
            "Authorization",
            "Bearer " + localStorage.getItem("access_token")
          );
        }
      }
    });
  }

  setState() {
    let idToken = localStorage.getItem("access_token");
    if (idToken) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  componentWillMount() {
    this.setup();
    this.parseHash();
    this.setState();
  }

  render() {
    if (this.loggedIn) {
      return <LoggedIn />;
    }
    return <Home />;
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);
  }
  authenticate() {
    // this.WebAuth = new auth0.WebAuth({
    //   domain: AUTH0_DOMAIN,
    //   clientID: AUTH0_CLIENT_ID,
    //   scope: "openid profile",
    //   audience: AUTH0_API_AUDIENCE,
    //   responseType: "token id_token",
    //   redirectUri: AUTH0_CALLBACK_URL
    // });
    // this.WebAuth.authorize();

    this.serverRequest();

  }

  serverRequest() {
    var id = document.getElementById("id").value;
    var password = document.getElementById("password").value;

    fetch('http://localhost:3000/api/auth/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        password: password,
      })
    })
    .then( (response) => {
      if (response.status != 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        alert(response.status)
        return null;
      }
      return response.json() })
    .then( (responseJson) => {
      if (responseJson != null) {
        localStorage.setItem("access_token", responseJson.token);
      }
      location.reload();
      return;
    } )
  }
  
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-4 col-xs-offset-4 jumbotron text-center">
            <h1>Mbears</h1>
            <br /><br /><br />
            <p>Sign in to get access </p>
            <br />
            <div className="form-group has-feedback">
              <input type="text" name="id" id="id" size="36" placeholder="ID"/>
              <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
            </div>
            <div className="form-group has-feedback">
              <input type="password" name="password" id="password" size="36" placeholder="Password"/>
              <span className="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <a
              onClick={this.authenticate}
              className="btn btn-primary btn-lg btn-login btn-block"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }
}

class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: []
    };

    this.serverRequest = this.serverRequest.bind(this);
    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem("access_token");
    location.reload();
  }

  serverRequest() {
    $.get("http://localhost:3000/api/jokes", res => {
      this.setState({
        jokes: res
      });
    });
  }

  componentDidMount() {
    this.serverRequest();
  }

  render() {
    return (
      <div className="container">
        <br />
        <span className="pull-right">
          <a onClick={this.logout}>Log out</a>
        </span>
        <h2>Jokeish</h2>
        <p>Let's feed you with some funny Jokes!!!</p>
        <div className="row">
          <div className="container">
            {this.state.jokes.map(function(joke, i) {
              return <Joke key={i} joke={joke} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

class Joke extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: "",
      jokes: []
    };
    this.like = this.like.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
  }

  like() {
    let joke = this.props.joke;
    this.serverRequest(joke);
  }
  serverRequest(joke) {
    $.post(
      "http://localhost:3000/api/jokes/like/" + joke.id,
      { like: 1 },
      res => {
        console.log("res... ", res);
        this.setState({ liked: "Liked!", jokes: res });
        this.props.jokes = res;
      }
    );
  }

  render() {
    return (
      <div className="col-xs-4">
        <div className="panel panel-default">
          <div className="panel-heading">
            #{this.props.joke.id}{" "}
            <span className="pull-right">{this.state.liked}</span>
          </div>
          <div className="panel-body joke-hld">{this.props.joke.joke}</div>
          <div className="panel-footer">
            {this.props.joke.likes} Likes &nbsp;
            <a onClick={this.like} className="btn btn-default">
              <span className="glyphicon glyphicon-thumbs-up" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("app"));
