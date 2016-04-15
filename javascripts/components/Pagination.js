import React from 'react';

export default class Pagination extends React.Component {

  render() {
    let prev = '';
    let next = '';
    let pages = [];
    let startIndex = Math.max(this.props.currentPage - 5, 0);
    let endIndex = Math.min(startIndex + 11, this.props.maxPage);

    if (this.props.currentPage > 0) {
      prev = (<a
        href="#companies"
        onClick={this.props.previous}
        className="pager-previous">{this.props.previousText}</a>);
    }

    if (this.props.currentPage != (this.props.maxPage - 1)) {
      next = (<a
        href="#companies"
        onClick={this.props.next}
        className="pager-next">{this.props.nextText}</a>);
    }

    if (this.props.maxPage >= 11 && (endIndex - startIndex) <= 10) {
      startIndex = endIndex - 11;
    }

    for (var i = startIndex; i < endIndex; i++) {
      let selected = this.props.currentPage == i ? 'is-selected' : '';
      pages.push(<li key={i}>
        <a href="#companies" onClick={this.pageChange} className={selected} data-value={i}>{i + 1}</a>
      </li>);
    }

    return (
      <div className="pager">
        <div className="pager-controls">
          {prev}
          <ul className="pager-items">
            {pages}
          </ul>
          {next}
        </div>
      </div>
    );
  }

  pageChange = (event) => {
    this.props.setPage(parseInt(event.target.getAttribute('data-value')));
  }
}

Pagination.propTypes = {
  maxPage: React.PropTypes.number,
  nextText: React.PropTypes.string,
  previousText: React.PropTypes.string,
  currentPage: React.PropTypes.number,
  previous: React.PropTypes.func,
  next: React.PropTypes.func,
  setPage: React.PropTypes.func
};
