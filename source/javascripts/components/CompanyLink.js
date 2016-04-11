import React from 'react';

export default (props) => {
  let url = `/companies/${props.rowData.id}.html`;
  return <a href={url}>{props.data}</a>;
};
