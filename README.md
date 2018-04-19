# Build a Golang app with the Gin framework, and authenticate with Auth0 + JWT

This repo contains the code samples for the [Build a Golang app with the Gin framework, and authenticate with Auth0 + JWT ](#) article.

## Setup

1. Update the `main.go` file with your Auth0 Credentials. [Sign up](https://auth0.com) for an account for free if you don't have one.
2. Update the `views/app.jsx` file with your Auth0 Credentials.
3. Add `http://localhost:3000` to your Allowed Callback, and Allowed Logout URL's in your [Auth0 Management Dashboard](https://manage.auth0.com).
4. Run `mv .env.sample .env` and update with valid credentials
5. Source the environment variables - `source .env`
6. Update dependencies `go get`
7. Launch the application by running `go run main.go`
8. Navigate to `localhost:3000` to view the application

## Author
[Francis Sunday](https://twitter.com/codehakase)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
