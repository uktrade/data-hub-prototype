'use strict';

const HIDE = 'hide';
const SHOW = 'show';

class ClippedList {

  constructor( element, showMessage, hideMessage, itemsToShow = 5 ){

    console.log( 'new ClippedList', element );

    if( !element ){ return; }

    this.items = element.getElementsByTagName( 'li' );

    if( this.items.length > itemsToShow ){

      this.element = element;
      this.itemsToShow = itemsToShow;
      this.showMessage = showMessage;
      this.hideMessage = hideMessage;
      this.control = this.createControl();

      this.setState( HIDE );

    } else {

      console.log( 'Not enough elements: ' + this.items.length );

      this.items = null;
    }
  }

  setExtraItemsStyle( style ){

    let i = this.itemsToShow;
    let l = this.items.length;

    for( ; i < l; i++ ){

      this.items[ i ].style.display = style;
    }
  }

  hideExtraItems(){

    this.setExtraItemsStyle( 'none' );
    this.updateControl( this.showMessage );
  }

  showExtraItems(){

    this.setExtraItemsStyle( '' );
    this.updateControl( this.hideMessage );
  }

  updateControl( text ){

    this.control.innerHTML = text;
  }

  createControl(){

    const control = document.createElement( 'a' );

    control.className = 'clipped-list-control';
    control.onclick = this.toggleState;
    control.href = '#';

    this.element.parentNode.insertBefore( control, this.element.nextSibling );

    return control;
  }

  toggleState = ( e ) => {

    e.target && ( typeof e.target.blur === 'function' ) && e.target.blur();

    this.setState( this.state === HIDE ? SHOW : HIDE );
  }

  setState( state ){

    this.state = state;

    switch( state ){

      case HIDE:

        this.hideExtraItems();
      break;

      case SHOW:

        this.showExtraItems();
      break;
    }
  }
}

export default ClippedList;
