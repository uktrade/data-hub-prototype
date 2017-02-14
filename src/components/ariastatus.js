const React = require('react')

function ariaStatus (props) {
  return (
    <span
      role='status'
      aria-live='polite'
      style={{
        left: '-9999px',
        position: 'absolute'
      }}
    >{props.message}</span>
  )
}

ariaStatus.propTypes = {
  message: React.PropTypes.string.isRequired
}

module.exports = ariaStatus
