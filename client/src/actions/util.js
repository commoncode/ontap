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
    return res.json();
  });
}

window.fetcher = fetcher;
