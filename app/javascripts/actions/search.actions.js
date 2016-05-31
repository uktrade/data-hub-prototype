import axios from 'axios';

export const SEARCH = 'SEARCH';
export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const UPDATE_TERM = 'UPDATE_TERM';

export function search(term, updateHistory = true) {

  if (updateHistory) {
    window.history.pushState({query: term}, `Search ${term}`, `/search?query=${term}`);
  }

  return {
    type: SEARCH,
    payload: axios.get(`/api/search?query=${term}`)
  };
}

export function addFilter(field, value) {

  // todo update url to list filters

  return {
    type: ADD_FILTER,
    payload: {
      field: field,
      value: value
    }
  };
}

export function removeFilter(field, value) {

  // todo update url to list filters

  return {
    type: REMOVE_FILTER,
    payload: {
      field: field,
      value: value
    }
  };
}

export function updateTerm(term) {
  return {
    type: UPDATE_TERM,
    payload: term
  };
}
