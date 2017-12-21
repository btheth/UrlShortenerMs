# UrlShortenerMs
URL shortener microservice for freecodecamp

Two query methods:

/url?\<url\> checks if \<url\> is a valid url. If so, it compares against the database to see if there is already a 
shortened version of the url. If so, that version is returned. If not, a shortened version is added, and that
is returned. The return object looks like {original_url:\<url\>, shortened_url:\<url\>} if valid.

/short?# checks if # is a shortened url in the database. If it is, the user is redirected to the page it was
shortened from.

In either case, if an invalid url is provided, the user is returned an object like this: {error: 'URL is invalid'}
