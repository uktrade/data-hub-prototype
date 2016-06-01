import { combineReducers } from 'redux';
import SearchResultsReducer from './searchresults.reducer';
import FacetsReducer from './facets.reducer';
import TermReducer from './term.reducer';

const rootReducer = combineReducers({
  results: SearchResultsReducer,
  facets: FacetsReducer,
  term: TermReducer
});

export default rootReducer;
