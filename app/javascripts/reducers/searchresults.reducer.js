import { SEARCH, ADD_FILTER, REMOVE_FILTER } from '../actions/search.actions';

const defaultStatus = {
  query: '',
  results: [],
  totalResults: 0,
  facets: {}
};
const defaultFilters = {
  type: [],
  company_status: [],
  source: []
};

let filters = Object.assign({}, defaultFilters);
let unfilteredResults = [];

function addFilter(filter, state) {

  let newState = Object.assign({}, state);
  let currentFilterValues = filters[filter.field];
  const index = currentFilterValues.findIndex((item) => { return item === filter.field.value; });

  if (index === -1) {
    filters[filter.field].push(filter.value);
  }

  return applyFilters(newState);

}

function removeFilter(filter, state) {
  let newState = Object.assign({}, state);
  filters[filter.field] = filters[filter.field].filter(item => item !== filter.value);
  return applyFilters(newState);
}

// Pass in 2 arrays and look for the intersect
function findOne(values, desired) {
  return desired.some((v) => {
    return values.indexOf(v) >= 0;
  });
}

function applyFilter(field, desiredValue, results) {
  return results.filter((result) => {

    var fieldValue = result[field];

    // Convert everything to arrays to cover when things are arrays
    // and when things are not, in a common function.
    if (!Array.isArray(fieldValue)) {
      fieldValue = [fieldValue];
    }

    if (!Array.isArray(desiredValue)) {
      desiredValue = [desiredValue];
    }

    // Now test if an element from the desired array is found in the record value array
    return findOne(fieldValue, desiredValue);
  });
}

function applyFilters(newState) {

  let results = unfilteredResults;

  for (let key in filters) {
    if (filters[key] && filters[key].length > 0) {
      results = applyFilter(key, filters[key], results);
    }
  }

  newState.results = results;
  newState.totalResults = results.length;

  return newState;
}



export default function(state = defaultStatus, action) {
  switch (action.type) {
    case SEARCH:
      unfilteredResults = action.payload.data.results;
      filters = Object.assign({}, defaultFilters);
      return Object.assign({}, state, action.payload.data);
    case ADD_FILTER:
      return addFilter(action.payload, state);
    case REMOVE_FILTER:
      return removeFilter(action.payload, state);
    default:
      return state;
  }
}
