import React from 'react';
import { connect } from 'react-redux';
import { clearFlashMessage } from '../actions/FlashMessageActions';

class FlashMessage extends React.Component {

  componentWillUnmount() {
    this.props.clearFlashMessage();
  }

  render() {
    if (this.props.flashMessage) {
      return <p role="alert" className="flash-message flash-message--success">{ this.props.flashMessage }</p>;
    }

    return null;
  }
}

FlashMessage.propTypes = {
  flashMessage: React.PropTypes.string,
  clearFlashMessage: React.PropTypes.func,
};


function mapStateToProps({ flashMessage }) {
  return { flashMessage };
}

export default connect(mapStateToProps, { clearFlashMessage })(FlashMessage);
