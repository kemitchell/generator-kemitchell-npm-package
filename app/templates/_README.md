<%= name %>
<%= new Array(name.length + 1).join('=') %>

[![npm version](https://img.shields.io/npm/v/<%= name %>.svg)](https://www.npmjs.com/package/<%= name %>)
[![license](https://img.shields.io/badge/license-Apache--2.0-303284.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![build status](https://img.shields.io/travis/<%= repository %>.svg)](http://travis-ci.org/<%= repository %>)

<%= props.description[0].toUpperCase() + props.description.slice(1) %>.

<!-- js
  // The examples below are run as tests.
  var <%= camelCaseName %> = require('./');
-->

```js
typeof <%= camelCaseName %>; // => 'function'
```
