import React from 'react';

class FieldTextRepeater extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
  }

  componentWillMount() {
    this.setState({
      fieldList: [{value: ''}]
    });
  }

  addItem(e) {
    e.preventDefault();
    this.setState({
      fieldList: this.state.fieldList.concat([{value: ''}])
    });
  }

  render() {
    const props = this.props;

    return (
      <div className="form-group form-group--compact">
        <label className="form-label" htmlFor={this.props.id}>{this.props.label}</label>
        {this.state.fieldList.map(function(item, i) {
          return (<input key={i} className="form-control" id={`${props.id}-${i}`} type="text" defaultValue={item.value} />);
        })}
        <p>
          <a href="#" onClick={this.addItem}>Add another {this.props.repeatLabel}</a>
        </p>
      </div>
    );
  }
}

FieldTextRepeater.propTypes = {
  id: React.PropTypes.string,
  label: React.PropTypes.string,
  repeatLabel: React.PropTypes.string,
};

export default FieldTextRepeater;
