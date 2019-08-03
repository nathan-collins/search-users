import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'

/**
 * @customElement
 * @polymer
 */
class SearchUsersApp extends PolymerElement {
  static get template () {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `
  }
  static get properties () {
    return {
      prop1: {
        type: String,
        value: 'search-users-app'
      }
    }
  }
}

window.customElements.define('search-users-app', SearchUsersApp)
