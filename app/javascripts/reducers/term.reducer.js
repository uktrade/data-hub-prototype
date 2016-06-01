import { SEARCH, UPDATE_TERM } from '../actions/search.actions';

export default function(state = '', action) {
  switch (action.type) {
    case SEARCH:
      return action.payload.data.query;
    case UPDATE_TERM:
      return action.payload;
  }

  return state;
}
