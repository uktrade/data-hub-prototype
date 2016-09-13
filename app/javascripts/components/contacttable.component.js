import React, { Component } from 'react';

var monthNames = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sept', 'Oct',
  'Nov', 'Dec'
];

function formatDate(date) {

  const parts = date.substr(0, 10).split('-');
  const dateTime = new Date(parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10));

  const day = dateTime.getDate();
  const monthIndex = dateTime.getMonth();
  const year = dateTime.getFullYear();
  return `${day} ${monthNames[monthIndex]} ${year}`;
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
      aValue = `${a.last_name} ${a.first_name}`.toLocaleLowerCase();
      bValue = `${b.last_name} ${b.first_name}`.toLocaleLowerCase();
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

    const link = `/contact/${contact.id}/view`;

    if (this.props.archived === true && contact.archive_date !== null ||
    this.props.archived === false && contact.archive_date === null) {

      let date = contact.archive_date === null ? formatDate(contact.created_date) : formatDate(contact.archive_date);

      return (
        <tr key={contact.id}>
          <td className="creationdate">{ date }</td>
          <td className="name"><a href={link}>{ contact.first_name } { contact.last_name }</a></td>
          <td className="title">{ contact.role }</td>
          <td className="phone">{ contact.phone }</td>
          <td className="email"><a href={'mailto:' + contact.email }>{ contact.email }</a></td>
        </tr>
      );
    }

    return null;
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
  archived: React.PropTypes.bool
};

export default ContactTable;
