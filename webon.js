// /**
//  * This is a JavaScript library that expresses HTML as similar as possible to HTML but in JavaScript.
//  * You can then do things such as updating parts of the HTML by raising events from a data store.
//  */

// Convenient functions
const pushRenderFunction = (element, renderFunction) => {
  element._render = element._render || []
  element._render.push(renderFunction)
}

const pushAttribute = (element, attribute) => {
  element._attributes = element._attributes || []
  element._attributes.push(attribute)
}

const appendRendered = (element, renderFunction) => {
  pushRenderFunction(element, renderFunction)
  createElement(element, renderFunction());
};

const removeAllChildren = (element) => {
  while (element.firstChild) {
    element.firstChild.remove();
  }
}

// Type helping functions
const isFunction = value => typeof value === 'function'
const isText = value => typeof value === 'string' || typeof value === 'number'
const isElement = value => value instanceof Element
const isArray = value => value instanceof Array
const isEventListenerDefinition = value => value.isEventListenerDefinition

const setEventListener = (parentElement, eventDefinition) => parentElement[`on${eventDefinition.eventType.toLowerCase()}`] = eventDefinition.listener;

// Element management
const tryAppendElement = (parentElement, value) => isElement(value) ? parentElement.appendChild(value) && true : false
const tryAppendText = (parentElement, value) => isText(value) ? parentElement.appendChild(document.createTextNode(value)) && true : false
const tryAppendElementsInArray = (parentElement, value) => isArray(value) ? value.forEach(element => parentElement.appendChild(element)) && true : false
const tryAppendRederer = (parentElement, value) => isFunction(value) ? appendRendered(parentElement, value) && true : false
const tryAddEventListener = (parentElement, value) => isEventListenerDefinition(value) ? setEventListener(parentElement, value) && true : false
const tryRefreshOn = (element, value) => {
  if (!value.isRefreshDefinition) {
    return false
  }

  addEventListener(value.refreshOn, () => {

    removeAllChildren(element)

    element._render && element._render.forEach(renderFunction => createElement(element, renderFunction()))
    element._attributes && element._attributes.forEach(applyDef => applyDef.fnToApply(element, applyDef.userProvidedFnOrVal))

  });

}
const tryApplyToElement = (element, value) => {

  if (!value.applyToElement) {
    return false
  }

  value.fnToApply(element, value.userProvidedFnOrVal)

  pushAttribute(element, value)

}

const createElement = (type, array) => {
  const parentElement =
    type instanceof Element ? type : document.createElement(type);

  if (!(array instanceof Array)) {
    array = [array];
  }

  array.forEach(value =>
    tryAppendElement(parentElement, value) ||
    tryAppendText(parentElement, value) ||
    tryAppendElementsInArray(parentElement, value) ||
    tryAppendRederer(parentElement, value) ||
    tryApplyToElement(parentElement, value) ||
    tryAddEventListener(parentElement, value) ||
    tryRefreshOn(parentElement, value)
  )

  return parentElement;
};

// Event handling
const on = (eventType, listener) => ({
  isEventListenerDefinition: true,
  eventType,
  listener,
});
export const onClick = (listener) => on("click", listener);
export const onBlur = (listener) => on("blur", listener);
export const onChange = (listener) => on("change", listener);
export const onMouseEnter = (listener) => on("mouseenter", listener);
export const onMouseLeave = (listener) => on("mouseleave", listener);
export const refreshOn = (eventName) => ({ isRefreshDefinition: true, refreshOn: eventName });

// Attribute definition
const applyToElement = (fnToApply) => (userProvidedFnOrVal) => ({
  applyToElement: true,
  userProvidedFnOrVal,
  fnToApply
})

const applyAttributeToElement = (attributeName) => applyToElement((element, userProvidedFnOrVal) => element[attributeName] = isFunction(userProvidedFnOrVal) ? userProvidedFnOrVal() : userProvidedFnOrVal)

export const style = applyAttributeToElement('style')
export const className = applyAttributeToElement('className')
export const value = applyAttributeToElement('value')
export const placeholder = applyAttributeToElement('placeholder')
export const id = applyAttributeToElement('id')
export const href = applyAttributeToElement('href')
export const target = applyAttributeToElement('target')
export const name = applyAttributeToElement('name')
export const type = applyAttributeToElement('type')

// element definition
export const input = (...args) => createElement("input", args);
export const section = (...args) => createElement("section", args);
export const head = (...args) => createElement("head", args);
export const span = (...args) => createElement("span", args);
export const div = (...args) => createElement("div", args);
export const h1 = (...args) => createElement("h1", args);
export const h2 = (...args) => createElement("h2", args);
export const h3 = (...args) => createElement("h3", args);
export const h4 = (...args) => createElement("h4", args);
export const h5 = (...args) => createElement("h5", args);
export const button = (...args) => createElement("button", args);
export const p = (...args) => createElement("p", args);
export const ul = (...args) => createElement("ul", args);
export const ol = (...args) => createElement("ol", args);
export const li = (...args) => createElement("li", args);
export const label = (...args) => createElement("label", args);
export const nav = (...args) => createElement("nav", args)
export const a = (...args) => createElement("a", args)
export const option = (...args) => createElement("option", args)
export const select = (...args) => createElement("select", args)
export const canvas = (...args) => createElement("canvas", args)
export const aside = (...args) => createElement("aside", args)
export const article = (...args) => createElement("article", args)

// css definition
export const css = (stylesheetDefinition) => {
  var sheet = document.createElement('style')
  sheet.innerHTML = stylesheetDefinition;
  document.head.appendChild(sheet);
}