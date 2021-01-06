// These are our required libraries to make the server work.

const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;
const valid = ['HEALTH', 'FIRE', 'PSC', 'DER', 'POLICE', 'SHERIFF', 'COUNTY EXECUTIVE', 'DPWT', 'COURTS', 'OCS', 'SOIL CONSERVATION', 'OHRM', 'OIT'];


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function processDataForFrontEnd(req, res) {
  const baseURL = 'https://data.princegeorgescountymd.gov/resource/baxv-ntrj.json'; // Enter the URL for the data you would like to retrieve here
  const agency = req.body.agency.toUpperCase();
  console.log(agency);
  const packet = ({ 'agencies': [] });
  if (!valid.includes(agency)) {
    packet.agencies.push({
      'Error_Message': `Sorry we could not find a PG County Office for ${req.body.agency}`,
      'Agency': valid
    });
    res.json(packet);
  } else {
    fetch(baseURL)
      .then((r) => r.json())
      .then((data) => {
        // process data
        for (let i = 0; i < data.length; i++ ) {
          if (data[i].agency === agency) {
            const office = data[i];
            const { address } = office;
            const street = JSON.parse(address.human_address);
            packet.agencies.push({
              'description': office.description,
              'human_address': `${street.address} ${street.city} ${street.state} ${street.zip}`,
              'city': street.city,
              'agency': office.agency,
              'long': office.address.longitude,
              'lat': office.address.latitude
            });
          }
        }
        console.log(packet);
        res.json(packet); // here's where we return data to the front end
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/error');
      });
  }
}
function processDataForList(req, res) {
  const baseURL = 'https://data.princegeorgescountymd.gov/resource/baxv-ntrj.json'; // Enter the URL for the data you would like to retrieve here
  const agency = req.body.agency.toUpperCase();
  console.log(agency);
  const packet = ({ 'agencies': [] });
  if (!valid.includes(agency)) {
    packet.agencies.push({
      'Error_Message': `Sorry we could not find a PG County Office for ${req.body.agency}`,
      'Agency': valid
    });
    res.json(packet);
  } else {
    fetch(baseURL)
      .then((r) => r.json())
      .then((data) => {
        // process data
        for (let i = 0; i < data.length; i++ ) {
          if (data[i].agency === agency) {
            const office = data[i];
            const { address } = office;
            const street = JSON.parse(address.human_address);
            packet.agencies.push({
              'description': office.description,
              'human_address': `${street.address} ${street.city}, ${street.state} ${street.zip}`,
              'city': street.city,
              'agency': office.agency
            });
          }
        }
        console.log(packet);
        res.json(packet); // here's where we return data to the front end
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/error');
      });
  }
}

function retrieveAll(res) {
  const baseURL = 'https://data.princegeorgescountymd.gov/resource/baxv-ntrj.json'; // Enter the URL for the data you would like to retrieve here
  const packet = ({ 'agencies': [] });

  fetch(baseURL)
    .then((r) => r.json())
    .then((data) => {
      // process data
      for (let i = 0; i < data.length; i++ ) {
        const office = data[i];
        const { address } = office;
        const street = JSON.parse(address.human_address);
        packet.agencies.push({
          'description': office.description,
          'human_address': `${street.address} ${street.city}, ${street.state} ${street.zip}`,
          'city': street.city,
          'agency': office.agency,
          'long': office.address.longitude,
          'lat': office.address.latitude
        });
      }
      console.log(packet);
      res.json(packet); // here's where we return data to the front end
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/error');
    });
}

app
  .route('/api')
  .get((req, res) => {
    console.log('all');
    retrieveAll(res);
  })
  .post((req, res) => {
    console.log('list');
    processDataForList(req, res);
  })
  .put((req, res) => {
    console.log('map');
    processDataForFrontEnd(req, res);
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
