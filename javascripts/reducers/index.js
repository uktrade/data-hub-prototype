import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import CompaniesReducer from './CompaniesReducer';

const rootReducer = combineReducers({
  companies: CompaniesReducer,
  form: formReducer,
});

export default rootReducer;
