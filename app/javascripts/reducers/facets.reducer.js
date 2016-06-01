import { SEARCH, ADD_FILTER, REMOVE_FILTER } from '../actions/search.actions';

let defaultFilters = {
  type: {},
  sectors: {},
  status: {}
};

function addFilter(filter, state) {
  let newState = Object.assign({}, state);
  newState[filter.field][filter.value].checked = true;
  return newState;
}

function removeFilter(filter, state) {
  let newState = Object.assign({}, state);
  newState[filter.field][filter.value].checked = false;
  return newState;
}

export default function(state = defaultFilters, action) {
  switch (action.type) {
    case SEARCH:
      return Object.assign({}, action.payload.data.facets);
    case ADD_FILTER:
      return addFilter(action.payload, state);
    case REMOVE_FILTER:
      return removeFilter(action.payload, state);
    default:
      return state;
  }
}
