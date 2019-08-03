import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { fetch } from 'whatwg-fetch';

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
      <paper-input id="searchField" label="Search" placeholder="Search User"></paper-input>
      <paper-button id="submitButton" on-click="searchUsers">Search</paper-button>
    `;
  }

  static get properties() {
    return {
      users: {
        type: Array,
        observer: 'usersChanged',
      },
    };
  }

  /**
   * @param {Event} event Search users in the github api
   */
  searchUsers(event) {
    fetch('https://api.github.com/users')
      .then(response => {
        return response.text();
      })
      .then(body => {
        this.set('users', body);
      });
  }

  /**
   * @param {Array} users A list of users from the api
   */
  usersChanged(users) {
    console.log('Users:', users);
  }
}

window.customElements.define('search-users-app', SearchUsersApp);
