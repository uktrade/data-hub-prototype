import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { search, updateTerm } from '../actions/search.actions';

class SearchBar extends Component {

  onInputChange = (event) => {
    this.props.updateTerm(event.target.value);
  };

  onFormSubmit = (event) => {
    event.preventDefault();
    this.props.search(this.props.term);
  };

  render() {
    return (
      <form
        className="js-searchbar searchbar"
        onSubmit={this.onFormSubmit}
        role="search">
        <div className="searchbar__wrapper">
          <input className="searchbar__input form-control"
                 type="search"
                 id="search-main"
                 name="query"
                 placeholder = "Search for company name or contact"
                 onChange={this.onInputChange}
                 value={this.props.term} />

          <input className="searchbar__submit" type="submit" value="Search" />
        </div>
      </form>

    );
  }
}


SearchBar.propTypes = {
  search: React.PropTypes.func.isRequired,
  term: React.PropTypes.string.isRequired,
  updateTerm: React.PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ search, updateTerm }, dispatch);
}

function mapStateToProps({ term }) {
  return { term };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
