const React = require('react')
const transformSectors = require('../lib/transformsectors')

class SectorSelect extends React.Component {

  static propTypes = {
    sector: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string
    }),
    allSectors: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string
    })),
    errors: React.PropTypes.arrayOf(React.PropTypes.string),
    onChange: React.PropTypes.func
  };

  constructor (props) {
    super(props)

    const allSectors = this.props.allSectors
    const sector = this.props.sector || { id: '', name: '' }
    const primarySector = transformSectors.getPrimarySectorName(sector.name) || ''

    this.allPrimarySectors = transformSectors.getAllPrimarySectors(allSectors)

    this.state = {
      primarySector,
      value: sector.id,
      errors: this.props.errors,
      subSectors: transformSectors.getAllSubSectors(primarySector, allSectors) || []
    }
  }

  onChangePrimarySector = (event) => {
    const primarySector = event.target.value
    const subSectors = transformSectors.getAllSubSectors(primarySector, this.props.allSectors)
    this.setState({ primarySector, subSectors, errors: null })

    // If the selected option has sub sectors, clear the current selected sector
    if (subSectors && subSectors.length > 0) {
      this.props.onChange({ name: 'sector', value: { name: event.target.value, id: null } })
    } else {
      // otherwise get the id for the current selected sector and send that to onChange
      this.props.onChange({ name: 'sector', value: transformSectors.getSectorForName(primarySector, this.props.allSectors) })
    }
  };

  onChangeSubSector = (event) => {
    const id = event.target.value
    const sector = transformSectors.getSectorForId(id, this.props.allSectors)
    this.setState({ value: id })
    this.props.onChange({ name: 'sector', value: sector })
  }

  render () {
    let primaryError
    let secondaryError

    if (this.state.errors && this.state.errors.length > 0) {
      if (this.state.subSectors && this.state.subSectors.length > 0 && !this.state.value) {
        secondaryError = this.props.errors[0]
      } else {
        primaryError = this.props.errors[0]
      }
    }

    return (
      <div>
        <div className={primaryError ? 'form-group error' : 'form-group'} id='primary-sector-wrapper'>
          <label className='form-label-bold' htmlFor='primary-sector'>
            Sector
            { primaryError && <span className='error-message'>{primaryError}</span> }
          </label>
          <select
            className='form-control'
            id='primary-sector'
            name='sector'
            onChange={this.onChangePrimarySector}
            value={this.state.primarySector}
          >
            <option value=''>Select option</option>
            { this.allPrimarySectors.map((sector, index) => <option key={index}>{sector}</option>) }
          </select>
        </div>

        { (this.state.subSectors && this.state.subSectors.length > 0) &&
          <div className={secondaryError ? 'sub-group error' : 'sub-group'}>
            <div className='form-group' id='sub-sector-wrapper'>
              <label className='form-label-bold' htmlFor='sub-sector'>
                Sub-sector
                { secondaryError && <span className='error-message'>{secondaryError}</span> }
              </label>
              <select
                className='form-control'
                id='sub-sector'
                name='sub-sector'
                onChange={this.onChangeSubSector}
                value={this.state.value || ''}
              >
                <option value=''>Select option</option>
                { this.state.subSectors.map((subSector, index) => <option key={index} value={subSector.id}>{subSector.name}</option>) }
              </select>
            </div>
          </div>
        }
      </div>
    )
  }
}

module.exports = SectorSelect
