import React from 'react';

const ContactLink = ({data}) =>
  <a href="#">
    {data}
  </a>;

ContactLink.propTypes = {
  data: React.PropTypes.string,
};

export default ContactLink;
