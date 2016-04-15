import { GET_COMPANIES, ADD_COMPANY, EDIT_COMPANY, GET_COMPANY } from '../actions/CompanyActions';

function updateCompany(currentCompanies, company) {
  return currentCompanies.all.map((item) => {
    if (item.id === company.id) {
      return company;
    }
    return item;
  });
}

export default function(state = { all: [], company: null }, action) {
  switch (action.type) {
    case GET_COMPANIES:
      return { all: action.payload.data.companies, company: null };
    case ADD_COMPANY:
      return { all: state.all.concat(action.payload), company: action.payload };
    case EDIT_COMPANY:
      return { all: updateCompany(state.all, action.payload), company: action.payload };
    case GET_COMPANY: {
      return { ...state, company: action.payload.data.company };
    }
    default:
      return state;
  }
}
