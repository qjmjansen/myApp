//// export module urlobject {

export interface Query {
  [index: string]: string;
}

/** Example results:

querystring == '' -> {}
querystring == '?' -> {'': null}
querystring == '?=' -> {'': ''}
querystring == '?' -> {}

Always returns an object (potentially empty)
*/
export function parseQuerystring(querystring: string): Query {
  var query: Query = {};
  // take the easy outs
  if (querystring === undefined || querystring === null || querystring === '') return query;
  // querystring is something. We'll assume it's a string.
  var parts = querystring.slice(1).split('&');
  parts.forEach(part => {
    // we treat `part = 'message='` differently from `part = 'message'`
    var [key, value] = part.split('=');
    // value will be undefined or a string, potentially empty, but never null
    if (value === undefined) {
      query[key] = null;
    }
    else {
      query[key] = decodeURIComponent(value);
    }
  });
  return query;
}

/** inverse of parseQuerystring()

query: Object
  Must not be null. May be an empty object.

If query is an empty object, returns the empty string.
Otherwise returns a string starting with '?', maybe with some other stuff.

Always returns a string.
*/
export function formatQuerystring(query: Query): string {
  var parts = [];
  for (var key in query) {
    var value = query[key];
    if (value === null) {
      parts.push(key);
    }
    else if (Array.isArray(value)) {
      for (var i = 0, length = value.length; i < length; i++) {
        var item = value[i];
        parts.push(key + '=' + encodeURIComponent(item));
      }

    }
    else {
      parts.push(key + '=' + encodeURIComponent(value));
    }
  }
  // parts.length == 0 iff Object.keys(query).length === 0
  if (parts.length > 0) {
    return '?' + parts.join('&');
  }
  return '';
}

/** Simplistic representation of a URL.

Auth is ignored, unusual protocols are not supported.

protocol: String
  http or https, usually
hostname: String
  Should generally be set if protocol is set.
port: Number | String
  Should generally be null. Otherwise, an integer.
path: String
  Leading slash is relevant when merging.
  If protocol, hostname, or port are set, path should have a leading slash.
query: Object
  Keys with null values produce no equals sign.
hash: String

All properties are nullable. If all are null, toString will return "".

An empty object for query is equivalent to null.
An empty string for port is equivalent to null.
All others have significant zero-values.
  E.g., hash = '' results in the url ending with a '#'

Redundant properties are not part of the representation; for example:
  * host = hostname + ':' + port
  * search = '?' + query.map(...).join('&')
*/
export class Url {
  protocol: string;
  hostname: string;
  port: string;
  path: string;
  query: Query = {};
  hash: string;

  constructor(urlObj: any = {}) {
    // use merge helper, even though it'll be overwriting everything, not really merging
    this.merge(urlObj);
  }

  /** URLUtils properties from MDN
  (https://developer.mozilla.org/en-US/docs/Web/API/URLUtils)

  - href
  - protocol
  - host
  - hostname
  - port
  - pathname
  - search
  - hash
  - username
  - password
  - origin
  - query (limited support)

  TODO: don't create a new element
  */
  static parse(urlString: string): Url {
    var anchor = document.createElement('a');
    anchor.href = urlString;
    var urlObj = new Url();
    urlObj.protocol = anchor.protocol.replace(/:+$/, '');
    urlObj.hostname = anchor.hostname;
    urlObj.port = anchor.port;
    urlObj.path = anchor.pathname;
    urlObj.query = parseQuerystring(anchor.search);
    // hash parsing is only marginally more complex than the other values
    //   note that the URLUtils does not distinguish between a trailing `#` and ``
    //   thus, anchor.hash is either '' or it starts with a '#' and has length > 1
    if (anchor.hash === '') {
      urlObj.hash = null;
    }
    else {
      urlObj.hash = anchor.hash.slice(1);
    }
    return urlObj;
  }

  /** merge: incorporate properties from urlObj.

  These properties are read from urlObj if available:

      protocol, hostname, port, path, query, hash

  */
  merge(urlObj: any = undefined) {
    if (urlObj === undefined || urlObj === null) return this;
    // these values are simply overwritten:
    var overwrite_props = ['protocol', 'hostname', 'port', 'hash'];
    for (var i = 0, prop; (prop = overwrite_props[i]) !== undefined; i++) {
      var value = urlObj[prop];
      if (value !== undefined) {
        this[prop] = value;
      }
    }
    // ignore undefined paths when merging
    if (urlObj.path !== undefined) {
      // the new path can be absolute or relative
      // null / absolute paths are just a wholesale overwrite
      if (urlObj.path === null || urlObj.path[0] === '/') {
        this.path = urlObj.path;
      }
      // otherwise it's appended to the current path
      else {
        this.path = (this.path || '') + urlObj.path;
      }
    }
    // if urlObj.query exists, it damn well better be an object,
    //   values from urlObj.query overwrite those in this.query if they share any keys
    // iterating over null and undefined is like iterating over [], so we can just iterate blindly here
    for (var key in urlObj.query) {
      var query_value = urlObj.query[key];
      if (query_value !== undefined) {
        this.query[key] = query_value;
      }
    }
    // chainable
    return this;
  }

  toString() {
    var parts: string[] = [];
    if (this.protocol !== undefined) {
      // protocol should not already have a trailing colon
      // TODO: check if it does
      parts.push(`${this.protocol}:`);
    }
    if (this.hostname !== undefined) {
      parts.push(`//${this.hostname}`);
    }
    if (this.port !== undefined) {
      parts.push(`:${this.port}`);
    }
    if (this.path !== undefined) {
      parts.push(this.path);
    }
    if (this.query !== undefined) {
      parts.push(formatQuerystring(this.query));
    }
    if (this.hash !== undefined) {
      parts.push(`#${this.hash}`);
    }
    return parts.join('');
  }
}

//// }
