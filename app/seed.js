'use strict';

const companyRepository = require('./lib/companyrepository');
const searchService = require('./lib/searchservice');


function seedUktiCustomers() {

  // Create 4 companies (fictional)

  // Sasie
  console.log('Search for Sasie')
  searchService.search('sasie ltd')
    .then(() => {
      console.log('Get Sasie details');
      return companyRepository.getCompany('05754478');
    })
    .then((company) => {
      company.sectors = ['Renewables'];
      company.website = 'http://sasie.co.uk/';
      company.businessDescription = 'Micro-generation Certification Scheme (MCS) approved in Solar Thermal, Solar Photovoltaic, Ground and Air Source Heat Pumps, Micro Wind Turbines, and Biomass technologies.';
      company.region = 'East midlands';
      company.accountManager = 'Jasper Spencer';
      company.exportingMarkets = ['Spain'];
      company.countryOfInterest = ['Greece'];

      console.log('update Sasie');
      companyRepository.updateCompany(company);
      console.log(`Added Company: ${company.id} - ${company.title} - ${company.website}`);
    });


  // Green footprint solutions
  console.log('Search for Green footprint')
  searchService.search('green footprint')
    .then(() => {
      console.log('Get green footprint  details');
      return companyRepository.getCompany('09000502');
    })
    .then((company) => {
      company.sectors = ['Renewables'];
      company.website = 'http://greenfs.co.uk/';
      company.businessDescription = 'Insulation of Agricultural Buildings, from Crop Stores through to Pack Houses and includes all types of Animal Housing.';
      company.region = 'East midlands';
      company.accountManager = 'Daniel Wright';
      company.exportingMarkets = null;
      company.countryOfInterest = ['Portugal'];

      console.log('update Green footprint');
      companyRepository.updateCompany(company);
      console.log(`Added Company: ${company.id} - ${company.title} - ${company.website}`);
    });


  // Freewatt group
  console.log('Search for Freewatt')
  searchService.search('freewatt')
    .then(() => {
      console.log('Get freewatt details');
      return companyRepository.getCompany('08527615');
    })
    .then((company) => {
      company.sectors = ['Renewables'];
      company.website = 'http://www.freewatt.co.uk/';
      company.businessDescription = 'Solar PV installation, vehicle charging solution, using bio mass boilers in home, business, farm, school or historic buildings';
      company.region = 'East midlands';
      company.accountManager = 'Julia Patrick';
      company.exportingMarkets = ['Germany'];
      company.countryOfInterest = ['Spain'];

      console.log('update Freewatt');
      companyRepository.updateCompany(company);
      console.log(`Added Company: ${company.id} - ${company.title} - ${company.website}`);
    });


  // Eco heat
  console.log('Search for Eco heat')
  searchService.search('eco heat')
    .then(() => {
      console.log('Get eco heat details');
      return companyRepository.getCompany('06877199');
    })
    .then((company) => {
      company.sectors = ['Renewables'];
      company.website = 'http://exoheatwise.co.uk/';
      company.businessDescription = 'The heat pump uses air-source heat pump technology. A Heat Pump Is an electrical device that extracts heat from one place and transfers it to another.';
      company.region = 'East midlands';
      company.accountManager = 'Fuad Hamzeh';
      company.exportingMarkets = null;
      company.countryOfInterest = ['Greece'];

      console.log('update eco heat');
      companyRepository.updateCompany(company);
      console.log(`Added Company: ${company.id} - ${company.title} - ${company.website}`);
    });
}


module.exports = {
  seedUktiCustomers
};
