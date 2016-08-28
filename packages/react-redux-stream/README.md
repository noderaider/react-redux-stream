## react-redux-stream

Streams a singleton redux state selector to one or more contexts (components or objects) within a react-redux application.

[![Build Status](https://travis-ci.org/noderaider/react-redux-stream.svg?branch=master)](https://travis-ci.org/noderaider/react-redux-stream)
[![codecov](https://codecov.io/gh/noderaider/react-redux-stream/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-redux-stream)

[![NPM](https://nodei.co/npm/react-redux-stream.png?stars=true&downloads=true)](https://nodei.co/npm/react-redux-stream/)

### Install

`npm install -S react-redux-stream`

### Usage

**lib/redux/streams/api.js** - Create a singleton streaming api context containing all react-redux bindings.

```jsx
import Stream from 'react-redux-stream'
import { createAction } from 'redux-actions'
import { createSelector } from 'reselect'

const fetchAction = createAction('FETCH', (apiName, ...args) => ({ apiName, args }))

/** Creates singleton streaming api context that houses all react-redux interaction (getState / dispatch) */
export default Stream ( 'api'
, storeSelector: store => createSelector(state => state.api, api =>
    /** Streams new api controller to all contexts 'api' property when api metadata changes. */
    { users: Object.assign( () => store.getState().users
                          , { fetch: (...args) => store.dispatch(fetchAction('users', ...args)
                            }
                          )
    }
  )
  /** Optionally pass a sharedContext object which will receive all updates of the api (useful for exposing on a global and console testing) */
[, window.app]
)
```


**lib/redux/store/subscribe.js** - Attach streams to store (observes and publishes redux state changes)
```jsx
import api from '../streams/api'

export default subscribe = store => { const detach = api.attach(store) }
```


**lib/components/Users.js** - Opt-in a component to stream api context

```jsx
import React, { Component } from 'react'
import api from '../redux/streams/api'

export default class Users extends Component {
  constructor(props) {
    super(props)
    api.context(this)
  }

  componentWillMount() {
    /** Dispatch action to fetch users */
    this.api.users.fetch()
  }

  render() {
    return (
      <div>
        <h2>Users</h2>
        <ul>
          {/** Map users from redux to api */}
          {this.api.users().map((user, key) => (
            <li key={key}>
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
```

### with react-stamp

**lib/components/Users.js** - Works very well with react-stamp

```jsx
import React from 'react'
import reactStamp from 'react-stamp'
import api from '../redux/streams/api'

const { compose } = reactStamp(React)

/** Centralize as component mix-in */
const desc = (
  { api: compose ({ init() { api.context(this) } })
  }
)

export default compose ( desc.api
, { displayName: 'Users'
  , componentWillMount() {
      /** Dispatch action to fetch users */
      this.api.users.fetch()
    }
  , render() {
      return (
        <div>
          <h2>Users</h2>
          <ul>
            {/** Map users from redux to api */}
            {this.api.users().map((user, key) => (
              <li key={key}>
                {user.firstName} {user.lastName}
              </li>
            ))}
          </ul>
        </div>
      )
    }
  }
)
```
