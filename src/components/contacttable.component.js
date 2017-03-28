'use strict'

const React = require('react')

class ContactTable extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      sortKey: 'name',
      sortAsc: true
    }
  }

  contactSorter = (a, b) => {
    let aValue
    let bValue

    if (this.state.sortKey === 'name') {
      aValue = `${a.last_name} ${a.first_name}`.toLocaleLowerCase()
      bValue = `${b.last_name} ${b.first_name}`.toLocaleLowerCase()
    } else {
      aValue = a[this.state.sortKey]
      bValue = b[this.state.sortKey]
    }

    let result = 0
    if (aValue < bValue) result = -1
    if (aValue > bValue) result = 1

    if (!this.state.sortAsc) {
      result = result - (result * 2)
    }

    return result
  };

  changeSort = (key) => {
    if (this.state.sortKey === key) {
      this.setState({
        sortKey: this.state.sortKey,
        sortAsc: !this.state.sortAsc
      })
    } else {
      this.setState({
        sortKey: key,
        sortAsc: true
      })
    }
  };

  renderContact = (contact) => {
    const link = `/contact/${contact.id}`
    return (
      <tr key={contact.id}>
        <td className='name'><a href={link}>{ contact.first_name } { contact.last_name }</a></td>
        <td className='title'>{ contact.job_title }</td>
        <td className='phone'>{ contact.telephone_number }</td>
        <td className='email'><a href={'mailto:' + contact.email}>{ contact.email }</a></td>
      </tr>
    )
  };

  columnClass (key) {
    if (this.state.sortKey === key && this.state.sortAsc) {
      return key.toLocaleLowerCase() + ' asc'
    } else if (this.state.sortKey === key && !this.state.sortAsc) {
      return key.toLocaleLowerCase() + ' desc'
    }
    return key.toLocaleLowerCase()
  }

  render () {
    if (!this.props.contacts) {
      return <div />
    }

    let rows = this.props.contacts.sort(this.contactSorter).map(this.renderContact)

    return (
      <table className='data-table contact-table' id='contact-table'>
        <thead>
          <tr>
            <th
              className={this.columnClass('name')}
              onClick={() => { this.changeSort('name') }}
          >Name</th>
            <th
              className={this.columnClass('occupation')}
              onClick={() => { this.changeSort('occupation') }}
          >Job title</th>
            <th
              className={this.columnClass('telephonenumber')}
              onClick={() => { this.changeSort('telephonenumber') }}
          >Phone</th>
            <th
              className={this.columnClass('emailaddress')}
              onClick={() => { this.changeSort('emailaddress') }}
          >Email</th>
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>

    )
  }

}

ContactTable.propTypes = {
  contacts: React.PropTypes.array.isRequired
}

module.exports = ContactTable
