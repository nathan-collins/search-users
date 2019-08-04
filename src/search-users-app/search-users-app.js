import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { fetch } from 'whatwg-fetch';
import listMixin from '../../mixins/ListMixin.js';

import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/iron-list/iron-list.js';

import '../../app-components/users-list.js';

const USERLIMIT = 30;
const PATH = 'https://api.github.com';
const API = {
  USER: `${PATH}/search/users`,
  SEARCH_USER: `${PATH}/users`,
  RATELIMIT: `${PATH}/rate_limit`,
};

/**
 * @customElement
 * @polymer
 */
class SearchUsersApp extends listMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }

        #searchContainer {
          display: flex;
          flex-direction: row;
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

        paper-radio-group {
          display: flex;
          flex-direction: column;
        }

        paper-input-container {
          padding: 0;
        }

        #userContainer {
          display: flex;
          justify-content: center;
        }

        .message {
          display: flex;
          justify-content: center;
        }
      </style>
      <dom-if if="[[message]]">
        <template>
          <div class="message">[[message]]</div>
        </template>
      </dom-if>

      <div id="searchContainer">
        <paper-input 
          id="searchField"
          label="Search" 
          placeholder="Search User"
          value="{{searchTerm}}">
        </paper-input>
        <paper-radio-group selected="{{sortBy}}" allow-empty-selection attr-for-selected="name">
          <paper-radio-button name="followers">Followers</paper-radio-button>
          <paper-radio-button name="repositories">Repositories</paper-radio-button>
          <paper-radio-button name="joined">Joined</paper-radio-button>
        </paper-radio-group>
        <paper-button id="submitButton" on-click="searchUsers">Search</paper-button>
      </div>

      <iron-scroll-threshold
        id="scroll" 
        on-lower-threshold="_loadMoreUsers" 
        lower-threshold="[[startPosition]]"
        scroll-target="document">
        <div id="userContainer">
          <users-list users-list="[[usersList]]"></users-list>
        </div>
      </iron-scroll-threshold>
    `;
  }

  static get properties() {
    return {
      lastUserId: {
        type: Number,
      },

      listPosition: {
        type: Number,
        value: 0,
      },

      previousUsers: {
        type: Array,
        value: () => {
          return [];
        },
      },

      searchTerm: {
        type: String,
        observer: 'searchTermChanged',
      },

      sortBy: {
        type: String,
      },

      startPosition: {
        type: Number,
        value: 0,
      },

      users: {
        type: Array,
        value: () => {
          return [];
        },
      },

      usersList: {
        type: Array,
        value: () => {
          return [];
        },
      },
    };
  }

  static get observers() {
    return ['usersChanged(users.*)'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkRateLimit(API);
  }

  /**
   *
   * @param {String} oldValue old search term
   * @param {String} newValue new search term
   */
  searchTermChanged(oldValue, newValue) {
    if (!oldValue || !newValue) return;
    this.set('changedSearchTerm', false);
    if (oldValue.toLowerCase() !== newValue.toLowerCase()) {
      this.set('changedSearchTerm', true);
    }
  }

  /**
   */
  _loadMoreUsers() {
    const scroll = this.$.scroll;

    setTimeout(() => {
      scroll.clearTriggers();
      if (this.startPosition > 0) {
        this.searchUsers();
      }
    });
  }

  /**
   */
  buildParameters() {
    const searchTerm = this.searchTerm.split(' ').join('+');

    let params = {};
    if (searchTerm !== '') {
      params.q = searchTerm;
    }
    if (this.sortBy) {
      params.sort = this.sortBy;
    }
    if (this.lastUserId) {
      params.since = this.lastUserId;
    }

    return params;
  }

  /**
   * @param {Event} event Search users in the github api
   */
  searchUsers() {
    if (this.isRateLimited) return;
    if (this.changedSearchTerm) {
      this.set('users', []);
    }

    const params = this.buildParameters();
    const apiPath = Object.keys(params).includes('q')
      ? API.USER
      : API.SEARCH_USER;

    const query = Object.keys(params)
      .map(key => key + '=' + params[key])
      .join('&');

    fetch(`${apiPath}?${query}`)
      .then(response => {
        return response.json();
      })
      .then(body => {
        let users = [];
        const keys = Object.keys(body);
        if (keys.includes('items')) {
          body.items.forEach(user => {
            users.push(user);
          });
          this.set('lastUserId', body.items.slice(-1)[0].id);
        } else {
          body.forEach(user => {
            users.push(user);
          });
          this.set('lastUserId', body.slice(-1)[0].id);
        }
        this.push('users', users);
      });
  }

  /**
   * @param {Array} users A list of users from the api
   */
  usersChanged(users) {
    if (!users || !users.base || users.length === 0) return;
    // So we save hitting this function to many times we flatten the array
    const flattenUsers = Array.prototype.concat.apply([], users.base);
    const usersList = flattenUsers.slice(this.startPosition, this.lastPosition);

    let previousUserIds;
    if (this.usersList) {
      previousUserIds = this.usersList.map(user => {
        return user.id;
      });
    }

    const newUsers = flattenUsers.map(user => {
      if (!previousUserIds.includes(user.id)) return user;
    });

    if (newUsers.length > 0) {
      this.set('startPosition', usersList.length);
      this.set('lastPosition', flattenUsers.length);
      this.set('usersList', flattenUsers);
    }
  }
}

window.customElements.define('search-users-app', SearchUsersApp);
