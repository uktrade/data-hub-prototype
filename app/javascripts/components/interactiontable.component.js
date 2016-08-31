import React, { Component } from 'react';

var monthNames = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sept', 'Oct',
  'Nov', 'Dec'
];

function formatDate(date) {
  const parts = date.split('/');
  const dateTime = new Date(parseInt(parts[2], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[0], 10));
  const day = dateTime.getDate();
  const monthIndex = dateTime.getMonth();
  const year = dateTime.getFullYear();
  return `${day} ${monthNames[monthIndex]} ${year - 2000}`;
}

class InteractionTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'creationdate',
      sortAsc: false
    };
  }

  interactionSorter = (a, b) => {

    let aValue;
    let bValue;

    if (this.state.sortKey == 'contact') {
      aValue = `${a.contact.lastname} ${a.contact.firstname}`.toLocaleLowerCase();
      bValue = `${b.contact.lastname} ${b.contact.firstname}`.toLocaleLowerCase();
    } else if (this.state.sortKey == 'advisor') {
      aValue = `${a.advisor.split(' ')[1]} ${a.advisor.split(' ')[0]}`.toLocaleLowerCase();
      bValue = `${b.advisor.split(' ')[1]} ${b.advisor.split(' ')[0]}`.toLocaleLowerCase();
    } else {
      aValue = a[this.state.sortKey];
      bValue = b[this.state.sortKey];
    }

    let result = 0;
    if (aValue < bValue) result = -1;
    if (aValue > bValue) result = 1;

    if (!this.state.sortAsc) {
      result = result - (result * 2);
    }

    return result;
  };

  changeSort = (key) => {

    if (this.state.sortKey === key) {
      this.setState({
        sortKey: this.state.sortKey,
        sortAsc: !this.state.sortAsc
      });
    } else {
      this.setState({
        sortKey: key,
        sortAsc: true
      });
    }
  };

  renderInteraction = (interaction) => {

    const link = `/companies/${this.props.company.id}/interaction/view/${interaction.id}?query=${this.props.query}`;

    return (
      <tr key={interaction.id}>
        <td className="date">{ formatDate(interaction.date) }</td>
        <td className="type">{ interaction.type }</td>
        <td className="advisor">{ interaction.advisor }</td>
        <td className="contact">{ interaction.contact.firstname } { interaction.contact.lastname }</td>
        <td className="subject"><a href={link}>{interaction.subject }</a></td>
      </tr>
    );
  };

  columnClass(key) {
    if (this.state.sortKey === key && this.state.sortAsc) {
      return key.toLocaleLowerCase() + ' asc';
    } else if (this.state.sortKey === key && !this.state.sortAsc) {
      return key.toLocaleLowerCase() + ' desc';
    }
    return key.toLocaleLowerCase();
  }

  render() {

    if (!this.props.interactions) {
      return <div/>;
    }

    let rows = this.props.interactions.sort(this.interactionSorter).map(this.renderInteraction);

    return (
      <table className="data-table interaction-table">
        <thead>
        <tr>
          <th
            className={this.columnClass('date')}
            onClick={() => {this.changeSort('date');}}
          >Date</th>
          <th
            className={this.columnClass('type')}
            onClick={() => {this.changeSort('type');}}
          >Type</th>
          <th
            className={this.columnClass('advisor')}
            onClick={() => {this.changeSort('advisor');}}
          >Advisor</th>
          <th
            className={this.columnClass('contact')}
            onClick={() => {this.changeSort('contact');}}
          >Company contact</th>
          <th
            className={this.columnClass('subject')}
            onClick={() => { this.changeSort('subject');}}
          >Subject</th>
        </tr>
        </thead>
        <tbody>
        { rows }
        </tbody>
      </table>

    );

  }

}

InteractionTable.propTypes = {
  company: React.PropTypes.object.isRequired,
  interactions: React.PropTypes.array,
  query: React.PropTypes.string.isRequired
};

export default InteractionTable;
