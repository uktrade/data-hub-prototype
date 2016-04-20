import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import CompaniesReducer from './CompaniesReducer';
import FlashMessageReducer from './FlashMessageReducer';

const rootReducer = combineReducers({
  companies: CompaniesReducer,
  form: formReducer,
  flashMessage: FlashMessageReducer,
});

export default rootReducer;
