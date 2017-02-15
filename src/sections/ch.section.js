const React = require('react');

function chSection(props) {
  const company = props.company;
  const chCompany = (company.companies_house_data && company.companies_house_data.company_number);

  if (!chCompany) return null;

  return (
    <table className="table--key-value table--readonly">
      <tbody>
        <tr className="table-detail--readonly__section">
          <td rowSpan="6" className="spacer">&nbsp;</td>
          <th>Company number</th>
          <td className="data">{ company.company_number }</td>
        </tr>
        <tr className="table-detail--readonly__section">
          <th>Registered office address</th>
          <td className="meta--address">
            { company.companies_house_data.registered_address_1 && company.companies_house_data.registered_address_1.toLocaleLowerCase() + ', ' }
            { company.companies_house_data.registered_address_2 && company.companies_house_data.registered_address_2.toLocaleLowerCase() + ', ' }
            { company.companies_house_data.registered_address_town && company.companies_house_data.registered_address_town.toLocaleLowerCase() + ', ' }
            { company.companies_house_data.registered_address_postcode &&
              <span className="meta--address__postcode">
                { company.companies_house_data.registered_address_postcode.toLocaleLowerCase() }
              </span>
            }
          </td>
        </tr>
        <tr>
          <th>Company type</th>
          <td>{ company.companies_house_data.company_category }</td>
        </tr>
        <tr className="table-detail--readonly__section">
          <th>Company status</th>
          <td>{ company.companies_house_data.company_status }</td>
        </tr>
        <tr className="table-detail--readonly__section">
          <th>Nature of business (SIC)</th>
          <td>
            <ul>
              { company.companies_house_data.sic_code_1 &&
                <li>{company.companies_house_data.sic_code_1}</li>
              }
              { company.companies_house_data.sic_code_2 &&
                <li>{company.companies_house_data.sic_code_2}</li>
              }
              { company.companies_house_data.sic_code_3 &&
                <li>{company.companies_house_data.sic_code_3}</li>
              }
              { company.companies_house_data.sic_code_4 &&
                <li>{company.companies_house_data.sic_code_4}</li>
              }
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

chSection.propTypes = {
  company: React.PropTypes.object,
};

module.exports = chSection;
