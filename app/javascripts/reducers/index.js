import { combineReducers } from 'redux';
import SearchResultsReducer from './searchresults.reducer';

const rootReducer = combineReducers({
  results: SearchResultsReducer
});

export default rootReducer;
