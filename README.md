# open matches

Open source platform to match coaches and learners.
The platform can be clone, customize and use.

## How to start

To start you need database link with username and password to add to your `env` file.
That's need to be send privately.

`npm i` needs to be run from root, from `client/` and from `server/` directory.

The project can be run from root or is also possible to go in the respective `client/` and `server/` directory and run just one of the two part.

from root:

to run in a local environment, frontend will be serve by webpack-dev-server
`npm run dev`
go to: `http://localhost:3000`
api url: `http://localhost:5000`

to run in a production mode. If run in this way, frontend is serve from a built file and require to be rebuild every time a change happen.
`npm start`
go to: `http://localhost:5000`
api url: `http://localhost:5000`

Check the `package.json` from each project root to discover which other command you can use to run the app or build it.
