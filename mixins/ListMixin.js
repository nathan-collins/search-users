/**
 * ListMixin - Description for mixin
 * @polymerMixin
 * @mixinFunction
 */
const ListMixin = superClass =>
  class extends superClass {
    /**
     * @return {Object} Properties
     */
    static get properties() {
      return {
        isRateLimited: {
          type: Boolean,
          value: false,
        },
      };
    }

    /**
     * Check for github rate limit
     * @param {API} Api paths
     * @return {Boolean} Has the api been rate limited
     */
    checkRateLimit(API) {
      return fetch(`${API.RATELIMIT}`)
        .then(response => {
          return response.json();
        })
        .then(body => {
          console.log(body);
          if (body.rate.remaining === 0) {
            const date = new Date(body.rate.reset * 1000);
            const hours = date.getHours();
            const minutes = '0' + date.getMinutes();
            const seconds = '0' + date.getSeconds();

            const formattedTime =
              hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

            this.set(
              'message',
              `Rate limit exceeded, it will be reset at: ${formattedTime}`
            );
          }

          this.set('isRateLimited', body.rate.remaining === 0);
        });
    }
  };

export default ListMixin;
