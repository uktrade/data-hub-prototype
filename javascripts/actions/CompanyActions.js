import axios from 'axios';

export const GET_COMPANIES = 'GET_COMPANIES';
export const GET_COMPANY = 'GET_COMPANY';
export const ADD_COMPANY = 'ADD_COMPANY';
export const EDIT_COMPANY = 'EDIT_COMPANY';

export function getCompanies() {
  return {
    type: GET_COMPANIES,
    payload: axios.get('/api/companies'),
  };
}

export function addCompany(company) {
  return ({
    type: ADD_COMPANY,
    payload: axios.post('/api/companies', { company }),
  });
}

export function editCompany(company) {
  return ({
    type: EDIT_COMPANY,
    payload: axios.put(`/api/companies/${company.id}`, { company })
  });
}

export function getCompany(id) {
  return ({
    type: GET_COMPANY,
    payload: axios.get(`/api/companies/${id}`),
  });
}
