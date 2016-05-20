import axios from 'axios';

export const SEARCH = 'SEARCH';
export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';

export function search(term) {
  return {
    type: SEARCH,
    payload: axios.get(`/api/search?query=${term}`)
  };
}

export function addFilter(field, value) {
  return {
    type: ADD_FILTER,
    payload: {
      field: field,
      value: value
    }
  };
}

export function removeFilter(field, value) {
  return {
    type: REMOVE_FILTER,
    payload: {
      field: field,
      value: value
    }
  };
}
