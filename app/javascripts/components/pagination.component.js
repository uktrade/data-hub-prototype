import React, { Component } from 'react';

export default class Pagination extends Component {

  render() {

    return (
      <div className="pagination">
        <div>
          <a href="#" className="pagination__page">1</a>
          <a href="#" className="pagination__page">2</a>
          <a href="#" className="pagination__page">3</a>
          <a href="#" className="pagination__page">Next</a>
        </div>
      </div>
    );
  }
}
