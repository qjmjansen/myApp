declare module "urlobject" {
    interface Query {
        [index: string]: string;
    }
    /** Example results:
    
    querystring == '' -> {}
    querystring == '?' -> {'': null}
    querystring == '?=' -> {'': ''}
    querystring == '?' -> {}
    
    Always returns an object (potentially empty)
    */
    function parseQuerystring(querystring: string): Query;
    /** inverse of parseQuerystring()
    
    query: Object
      Must not be null. May be an empty object.
    
    If query is an empty object, returns the empty string.
    Otherwise returns a string starting with '?', maybe with some other stuff.
    
    Always returns a string.
    */
    function formatQuerystring(query: Query): string;
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
    class Url {
        protocol: string;
        hostname: string;
        port: string;
        path: string;
        query: Query;
        hash: string;
        constructor(urlObj?: any);
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
        static parse(urlString: string): Url;
        /** merge: incorporate properties from urlObj.
      
        These properties are read from urlObj if available:
      
            protocol, hostname, port, path, query, hash
      
        */
        merge(urlObj?: any): Url;
        toString(): string;
    }
}
