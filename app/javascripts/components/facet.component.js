import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addFilter, removeFilter } from '../actions/search.actions';


class Facet extends Component {

  filterChange = (event) => {
    if (event.target.checked) {
      this.props.addFilter(event.target.name, event.target.value);
    } else {
      this.props.removeFilter(event.target.name, event.target.value);
    }
  };


  render() {

    if (this.props.options.length > 1) {

      return (
        <div className="govuk-option-select js-collapsible">
          <button className="js-container-head" type="button" aria-expanded="false">
            <div className="option-select-label">{this.props.title}</div>
          </button>
          <div className="options-container">
            <div className="js-auto-height-inner">
              {this.props.options.map((option, index) => {
                if (option != '') {
                  return (
                    <div key={index}>
                      <label>
                        <input
                          name={this.props.name}
                          type="checkbox"
                          value={option}
                          onChange={this.filterChange}
                        />
                        {option}
                      </label>
                    </div>
                  );
                }

                return '';

              })}
            </div>
          </div>
        </div>
      );
    }

    return (<div/>);

  }

}


Facet.propTypes = {
  addFilter: React.PropTypes.func.isRequired,
  removeFilter: React.PropTypes.func.isRequired,
  filters: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  options: React.PropTypes.array.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addFilter, removeFilter }, dispatch);
}

function mapStateToProps({ results }) {
  return { filters: results.filters };
}

export default connect(mapStateToProps, mapDispatchToProps)(Facet);
