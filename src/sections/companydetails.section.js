/* global document: true */
const React = require('react');
const CHSection = require('./ch.section');
const { Link } = require('react-router');

function companyDetailsSection(props) {
  const company = props.company;
  const { source, sourceId } = props.params;
  const chCompany = (company.companies_house_data && company.companies_house_data.company_number);
  if (typeof window !== 'undefined') {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  return (
    <div>
      <CHSection company={company} />

      { company.id &&
        <table className="table-detail">
          <tbody>
          {!chCompany &&
          <tr>
            <th>Registered address</th>
            <td>
              { company.registered_address_1 && `${company.registered_address_1}, ` }
              { company.registered_address_2 && `${company.registered_address_2}, ` }
              { company.registered_address_town && `${company.registered_address_town}, ` }
              { company.registered_address_county && `${company.registered_address_county}, ` }
              { company.registered_address_postcode &&
              <span className="meta--address__postcode">
                  {`${company.registered_address_postcode}, `}
                </span>
              }
              { (company.registered_address_country && company.registered_address_country) &&
              company.registered_address_country.name
              }
            </td>
          </tr>
          }
          {!chCompany &&
          <tr>
            <th>Company type</th>
            <td>{ company.business_type.name }</td>
          </tr>
          }
          <tr>
            <th>Sector</th>
            <td>{ company.sector.name }
            </td>
          </tr>
          <tr>
            <th>Trading name</th>
            <td>{ company.alias }
            </td>
          </tr>
          <tr>
            <th>Trading address</th>
            <td>
              { company.trading_address_1 && `${company.trading_address_1}, ` }
              { company.trading_address_2 && `${company.trading_address_2}, ` }
              { company.trading_address_town && `${company.trading_address_town}, ` }
              { company.trading_address_county && `${company.trading_address_county}, ` }
              { company.trading_address_postcode &&
              <span className="meta--address__postcode">
                  {`${company.trading_address_postcode}, `}
                </span>
              }
              { (company.trading_address_country && company.trading_address_country) &&
              company.trading_address_country.name
              }
            </td>
          </tr>
          <tr>
            <th>Website</th>
            <td>
              {company.website &&
              <a href="{ company.website }">{ company.website }</a>
              }
            </td>
          </tr>
          <tr>
            <th>Business description</th>
            <td>{ company.description }</td>
          </tr>
          <tr>
            <th>Number of employees</th>
            <td>{ company.employee_range && company.employee_range.name }</td>
          </tr>
          <tr>
            <th>Annual turnover</th>
            <td>{ company.turnover_range && company.turnover_range.name }</td>
          </tr>

          <tr>
            <th>Region</th>
            <td>{ company.uk_region && company.uk_region.name }</td>
          </tr>
          <tr>
            <th>Account manager</th>
            <td>{ (company.account_manager && company.account_manager.name) && company.account_manager.name }</td>
          </tr>
          <tr>
            <th>Is the company currently <br />exporting to a market?</th>
            <td>
              { (company.export_to_countries && company.export_to_countries.length > 0 && company.export_to_countries[0].id !== null && company.export_to_countries[0].id.length > 0) ?
                <div>Yes
                  { company.export_to_countries.map((country, index) => <div key={index}>{country.name}</div>)}
                </div>
                :
                <div>No</div>
              }
            </td>
          </tr>
          <tr>
            <th>Future countries of interest</th>
            <td>
              { company.future_interest_countries &&
              <div>
                { company.future_interest_countries.map((country, index) => <div key={index}>{country.name}</div>) }
              </div>
              }
            </td>
          </tr>
          </tbody>
        </table>
      }
      { !props.archiveVisible &&
        <div className="button-bar">
          { (!company.archived) ?
            <div>
              <Link to={`/company/${source}/${sourceId}/edit`} className="button button-secondary js-button-edit">Edit
                company details</Link>
              <button className="button button-secondary" onClick={props.showArchiveSection}>Archive company</button>
            </div>
            :
            <div>
              <a className="button button-disabled">Edit company details</a>
              <button className="button button-secondary" onClick={props.unarchive}>Unarchive now</button>
            </div>
          }
        </div>
      }
    </div>
  );
}

companyDetailsSection.propTypes = {
  company: React.PropTypes.object,
  showArchiveSection: React.PropTypes.func,
  unarchive: React.PropTypes.func,
  archiveVisible: React.PropTypes.bool,
  params: React.PropTypes.object,
};


module.exports = companyDetailsSection;
