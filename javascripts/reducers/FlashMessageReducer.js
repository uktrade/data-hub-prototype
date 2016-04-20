import { SET_FLASH_MESSAGE, CLEAR_FLASH_MESSAGE } from '../actions/FlashMessageActions';
import { ADD_COMPANY } from '../actions/CompanyActions';

const COMPANY_ADDED_MESSAGE = 'Company details has been saved';

export default function(state = null, action) {
  switch (action.type) {
    case ADD_COMPANY:
      return COMPANY_ADDED_MESSAGE;
    case SET_FLASH_MESSAGE:
      return action.payload;
    case CLEAR_FLASH_MESSAGE:
      return null;
    default:
      return state;
  }
}
