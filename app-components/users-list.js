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
      usersList: {
        type: Array,
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
                [[user.login]]
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
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Use for one-time configuration of your component after local
   * DOM is initialized.
   */
  ready() {
    super.ready();
  }
}

customElements.define('users-list', UsersList);
