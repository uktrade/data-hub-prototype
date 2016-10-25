import React from 'react';
import ReactDOM from 'react-dom';
import {CompanyForm} from './sections/companyform';

ReactDOM.render(
  <div>
    <a className="back-link" href='/'>Back to home</a>
    <h1 className="heading-xlarge">
      Add new company
    </h1>
    <CompanyForm/>
  </div>,
  document.getElementById('react-app')
);
