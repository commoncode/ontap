/**
 * Action utils
 */

// fetch() options for sending ajax and cookies
export const headers = new Headers();
headers.set('Content-Type', 'application/json');
export const credentials = 'same-origin';


// Wrap errors so they're a bit more useful
// todo - finish this idea
export function CleanError(props) {
  this.isClean = true;
  Object.assign(this, {
    code: 500,
    message: 'Something went wrong',
  }, props);
}

// wrap `fetch` to handle errors nicely
export function fetcher(path, opts) {
  return fetch(path, Object.assign({
    headers,
    credentials,
  }, opts)).then((res) => {
    if (!res.ok) {
      throw new CleanError({
        code: res.status,
        message: res.statusText,
      });
    }

    // don't try and parse 204s
    // todo - better way to detect whether we're receiving json?
    // check the headers i guess
    if (res.status === 204) {
      return {};
    }
    return res.json();
  });
}

/**
 * return a copy of an object that replaces
 * all empty strings with null.
 * @param  {Object} obj
 * @return {Object}
 */
export function nullify(obj) {
  return Object.keys(obj).reduce((memo, key) => {
    memo[key] = obj[key] === '' ? null : obj[key];
    return memo;
  }, {});
}
