# open matches

Open source backbone platform to support educational organization to match their coaches and learners.
The platform is intended to be clone and customize with specific brand.

## Documentation
Please find all the valuable information in the [Wiki](https://github.com/gsambrotta/open-matches/wiki)

## How to start

The project is based in Nodejs, npm, Mongodb.
You will need to have install on your machine: 
* `Nodejs > 8` 
* `npm` 
* set up a `mongodb`
This can be done locally or with cloud service, as you prefer.
Once you have the databse string, you can add to your `env` file and it will work.


Once you clone the repo go ahead and install all the packages:
* `npm i` must be run from `root`, from `client/` and from `server/` directory.
* `cd open-matches && npm i`
* `cd open-matches/client && npm i`
* `cd open-matches/server && npm i`


The project can run from `root` or you can run `client` and `server` separately from each respective diretcory.

To run the project from `root`:

**Development**

`npm run dev`: project will run in development mode, the frontend is serve by webpack-dev-server

go to: `http://localhost:3000`

api url: `http://localhost:5000`

**Production**

`npm start`: project will run in production mode. If run in this way, frontend is serve from a built file and require to be rebuild every time a change happen.

go to: `http://localhost:5000`

api url: `http://localhost:5000`


Check the `package.json` of `client` and `server` to discover which other command you can use to run or build the app.

=======================

If you encounter any problem in the installation, please open an issue
