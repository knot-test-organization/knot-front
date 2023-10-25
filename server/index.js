const express = require('express');
const bodyParser = require('body-parser');
const FormData = require('form-data');
const cors = require('cors');
// const fetch = require("node-fetch");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'text/*' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cors());

let user = '';
let accessToken = '';
const organizationName = 'NTTData-HybridCloud';

app.post('/authenticate', (req, res) => {
  const { code } = req.body;

  const data = new FormData();
  data.append('client_id', '9d5b3500c699be3762b0');
  data.append('client_secret', 'ca7ec04eefbbd3e4a37b4fd31a549a09b78431fd');
  data.append('code', code);
  data.append('redirect_uri', 'http://knot.westeurope.cloudapp.azure.com/');

  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: 'POST',
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      const params = new URLSearchParams(paramsString);
      accessToken = params.get('access_token');

      // Request to return data of a user that has been authenticated
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => {
      user = response;

      return fetch('https://api.github.com/orgs/' + organizationName + '/memberships/' + user.name, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => {
      const data = {
        user: user,
        token: accessToken,
      };
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

app.get('/', (req, res) => {
  console.log('Running...');
});

const PORT = 80 || 3000;
// const HOST = "40.68.78.70";
app.listen(PORT, () => console.log(` Running on -> ${PORT}`));
