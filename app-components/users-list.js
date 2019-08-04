import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

/**
 * `users-list` Description
 *
 * @customElement
 * @polymer
 * @demo
 *
 */
class UsersList extends PolymerElement {
  static get properties() {
    return {
      previousTotal: {
        type: Number,
        value: 0,
      },

      usersList: {
        type: Array,
        observer: 'usersListChanged',
      },
    };
  }

  static get template() {
    return html`
      <style>
        #usersList {
          max-width: 404px;
        }

        paper-card {
          --paper-card-header-image: {
            max-width: 200px; /* Also works with percentage value like 100% */
            height: auto;
            object-fit: contain;
            background-size: cover;
            background-position: center center;
          }
        }
      </style>
      <div id="usersList">
        <dom-repeat items="[[usersList]]" as="user" alt="[[user.login]]">
          <template>
            <paper-card image="[[user.avatar_url]]">
              <div class="card-content">
                <a href="[[user.html_url]]" target="_blank">[[user.login]]</a>
                <span>[[followers]]</span>
              </div>
              <div class="card-actions">

              </div>
            </paper-card>
          </template>
        </dom-repeat>
      </div>
    `;
  }

  /**
   */
  usersListChanged(usersList) {
    usersList.forEach((user, index) => {
      if (index >= this.previousTotal) {
        this.set('followers', this.getFollowersNumber(user.followers_url));
      }
    });
    this.set('previousTotal', usersList.length);
  }

  /**
   *
   * @param {String} followersPath Path for the followers
   */
  getFollowersNumber(followersPath) {
    return fetch(`${followersPath}`).then(body => {
      return body.length;
    });
  }
}

customElements.define('users-list', UsersList);
