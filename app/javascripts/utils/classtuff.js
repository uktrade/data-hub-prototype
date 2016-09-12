var regularExp1 = '(\\s|^)',
  regularExp2 = '(\\s|$)';

export function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    if (!hasClass(element, className)) {
      element.className += " " + className;
    }
  }
}

export function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    if (hasClass(element, className)) {
      var regClass = new RegExp(regularExp1 + className + regularExp2);
      element.className = element.className.replace(regClass, ' ');
    }
  }
}

export function hasClass(element, className) {
  if (element.classList) {
    return element.classList.contains(className);
  } else {
    return !!element.className.match(new RegExp(regularExp1 + className + regularExp2));
  }
}
