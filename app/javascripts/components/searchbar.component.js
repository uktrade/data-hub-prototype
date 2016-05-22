import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { search } from '../actions/search.actions';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = { query: props.query };
  }

  onInputChange = (event) => {
    this.setState({ query: event.target.value });
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
                 autoComplete="off"
                 placeholder = "Search for company name or contact"
                 onChange={this.onInputChange}
                 value={this.state.query} />

          <input className="searchbar__submit" type="submit" value="Search" />
        </div>
      </form>

    );
  }
}


SearchBar.propTypes = {
  search: React.PropTypes.func,
  query: React.PropTypes.string
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ search }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchBar);
