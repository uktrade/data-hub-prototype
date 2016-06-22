'use strict';

const rp = require('request-promise');
const config = require('../../config');

let lookupHistory = {
  'nn13er': [{
    city: ' Northampton',
    address1: '10 Watkin Terrace',
    address2: ' ',
    postcode: 'NN13ER'
  },
    {
      city: ' Northampton',
      address1: '12 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '14 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '16 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '18 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '2 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '20 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '22 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '24 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '26 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '26a Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '26b Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '26c Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '26d Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '28 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '2a Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '30 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '32 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '36 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '38 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '4 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '40 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '40b Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '42 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '44 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '46 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '48 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '50 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: '8 Watkin Terrace',
      address2: ' ',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 1',
      address2: ' 6 Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 1 -  Watkin Court',
      address2: ' Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 2',
      address2: ' 6 Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 2 -  Watkin Court',
      address2: ' Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 3',
      address2: ' 6 Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 3 -  Watkin Court',
      address2: ' Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 4',
      address2: ' 6 Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 4 -  Watkin Court',
      address2: ' Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 5 -  Watkin Court',
      address2: ' Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 6 -  Watkin Court',
      address2: ' Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 7 -  Watkin Court',
      address2: ' Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 8 -  Watkin Court',
      address2: ' Watkin Terrace',
      postcode: 'NN13ER'
    },
    {
      city: ' Northampton',
      address1: 'Flat 9 -  Watkin Court',
      address2: ' Watkin Terrace',
      postcode: 'NN13ER'
    }]
};

function lookupAddress(postcode) {
  return new Promise((fulfill, reject) => {

    let formattedPostcode = tidyPostcode(postcode);

    if (lookupHistory[formattedPostcode]) {
      fulfill(lookupHistory[formattedPostcode]);
      return;
    }

    let baseUrl = config.postcodeLookup.baseUrl;
    let postcodeKey = config.postcodeLookup.apiKey;
    let url = baseUrl.replace('{postcode}', formattedPostcode).replace('{api-key}', postcodeKey);

    rp({ url, json: true })
      .then((data) => {
        let parsed = parsePostcodeResult(data, postcode.toLocaleUpperCase());
        lookupHistory[formattedPostcode] = parsed;
        fulfill(parsed);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function tidyPostcode(postcode) {
  return postcode.replace(/\s+/g, '').toLocaleLowerCase();
}

function parsePostcodeResult(data, postcode) {

  if (!data || !data.Addresses) {
    return null;
  }

  return data.Addresses.map((address) => {
    let split = address.split(',');
    let parsedAddress = {};
    if (split[5].trim().length > 0) {
      parsedAddress.county = split[6];
      parsedAddress.city = split[5];
    } else {
      parsedAddress.city = split[6];
    }
    if (split[2].trim().length > 0) {
      parsedAddress.address1 = split[0] + ' - ' + split[1];
      parsedAddress.address2 = split[2];
    } else {
      parsedAddress.address1 = split[0];
      parsedAddress.address2 = split[1];
    }
    parsedAddress.postcode = postcode;
    return parsedAddress;
  });
}
module.exports = {
  lookupAddress
};

