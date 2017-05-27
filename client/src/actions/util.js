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
  }, opts))
  .catch(() => { // eslint-disable-line arrow-body-style
    // a rejection here means a network error.
    // handle it below...
    return {
      ok: false,
      status: 0,
      statusText: 'Network Error',
    };
  })
  .then((res) => {
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
 * Return a copy of an object that replaces empty strings with null
 * for any keys specified in keys[]
 * @param  {Object} obj
 * @param  {Array} keys
 * @return {Object}
 */
export function nullify(obj, keys) {
  const copy = {
    ...obj,
  };
  keys.forEach((key) => {
    if (copy[key] === '') copy[key] = null;
  });
  return copy;
}
