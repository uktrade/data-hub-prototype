/* global window: true, document: true */
const React = require('react')
const CHSection = require('./ch.section')
const CompanyForm = require('../forms/companyform')

function companyEditSection (props) {
  const { company, source, sourceId } = props
  if (typeof window !== 'undefined') {
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  return (
    <div>
      <CHSection company={company} />
      <CompanyForm company={company} source={source} sourceId={sourceId} updateCompany={props.updateCompany} />
    </div>
  )
}

companyEditSection.propTypes = {
  company: React.PropTypes.object,
  source: React.PropTypes.string,
  sourceId: React.PropTypes.string,
  updateCompany: React.PropTypes.func
}

module.exports = companyEditSection
