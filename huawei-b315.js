#!/usr/bin/env node

'use strict';

const rp = require('request-promise-native');
const xml2js = require('xml2js');
const promisify = require("es6-promisify");
const parseXml = promisify(xml2js.parseString);

const HOSTNAME = 'dna.mokkula';

rp({
  uri: `http://${HOSTNAME}/html/home.html`,
  resolveWithFullResponse: true,
})
.then((response) => {
  const cookie = response.headers['set-cookie'][0];
  return rp({
    uri: `http://${HOSTNAME}/api/monitoring/status`,
    headers: {
      cookie,
    },
  });
})
.then((response) => {
  return parseXml(response);
})
.then((xml) => {
  if (process.argv.length === 3) {
    const field = process.argv[2];
    console.log(xml.response[field][0]);
  } else {
    console.log(JSON.stringify(xml.response, null, 2));
  }
  process.exit(0);
})
.catch((err) => {
  console.dir(err);
});

// vim: ts=2 sw=2
