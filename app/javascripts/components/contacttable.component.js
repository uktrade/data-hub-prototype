import React, { Component } from 'react';

var monthNames = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sept', 'Oct',
  'Nov', 'Dec'
];

function formatDate(date) {
  const dateTime = new Date(date);
  const day = dateTime.getDate();
  const monthIndex = dateTime.getMonth();
  const year = dateTime.getFullYear();
  return `${day} ${monthNames[monthIndex]} ${year - 2000}`;
}

class ContactTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'name',
      sortAsc: true
    };
  }

  contactSorter = (a, b) => {

    let aValue;
    let bValue;

    if (this.state.sortKey == 'name') {
      aValue = `${a.lastname} ${a.firstname}`.toLocaleLowerCase();
      bValue = `${b.lastname} ${b.firstname}`.toLocaleLowerCase();
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

  renderContact = (contact) => {

    const link = `/companies/${this.props.company.id}/contact/view/${contact.id}?query=${this.props.query}`;

    return (
      <tr key={contact.id}>
        <td className="creationdate">{ formatDate(contact.creationdate) }</td>
        <td className="name"><a href={link}>{ contact.firstname } { contact.lastname }</a></td>
        <td className="title">{ contact.occupation }</td>
        <td className="phone">{ contact.telephonenumber }</td>
        <td className="email"><a href={'mailto:' + contact.emailaddress }>{ contact.emailaddress }</a></td>
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

    if (!this.props.contacts) {
      return <div/>;
    }

    let rows = this.props.contacts.sort(this.contactSorter).map(this.renderContact);

    return (
      <table className="data-table contact-table" id="contact-table">
        <thead>
        <tr>
          <th
            className={this.columnClass('creationdate')}
            onClick={() => {this.changeSort('creationdate');}}
          >Date</th>
          <th
            className={this.columnClass('name')}
            onClick={() => {this.changeSort('name');}}
          >Name</th>
          <th
            className={this.columnClass('occupation')}
            onClick={() => {this.changeSort('occupation');}}
          >Title</th>
          <th
            className={this.columnClass('telephonenumber')}
            onClick={() => {this.changeSort('telephonenumber');}}
          >Phone</th>
          <th
            className={this.columnClass('emailaddress')}
            onClick={() => { this.changeSort('emailaddress');}}
          >Email</th>
        </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>

    );

  }

}

ContactTable.propTypes = {
  company: React.PropTypes.object.isRequired,
  contacts: React.PropTypes.array,
  query: React.PropTypes.string.isRequired
};

export default ContactTable;
