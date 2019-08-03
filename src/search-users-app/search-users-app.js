import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

/**
 * @customElement
 * @polymer
 */
class SearchUsersApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          justify-content: center;
        }

        paper-button {
          border: 1px solid #000;
          background: #E8E8E8;
          padding: 0;
        }

        paper-input {
          border: 1px solid #000;
          padding: 0;
        }

        paper-input-container {
          padding: 0;
        }
      </style>
      <paper-input id="searchField" label="Search" placeholder="Search User"></paper-input><paper-button on-click="searchUsers">Search</paper-button>
    `;
  }

  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'search-users-app',
      },
    };
  }

  /**
   * @param {Event} event Search users in the github api
   */
  searchUsers(event) {}
}

window.customElements.define('search-users-app', SearchUsersApp);
