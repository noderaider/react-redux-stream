import createPropStream from './utils/createPropStream'
import observeStore from './utils/observeStore'
import * as define from './utils/define'
const should = require('chai').should()

/**
 * Creates a streaming context that updates a target context that
 * can be attached to a store and streamed to one or more contexts
 */
export default function Stream (streamKey, storeSelector, sharedContext = {}, { verbose = false } = {}) {
  should.exist(streamKey, 'must specify a key to stream to context')
  should.exist(storeSelector, 'must specify a storeSelector factory function')

  const opts = { verbose }

  const propStream = createPropStream (streamKey, sharedContext, opts)

  let isAttached = false
  function attach (store) {
    isAttached.should.be.false
    isAttached = true

    const dispose = propStream.listen()
    const select = storeSelector(store)
    should.exist(select)
    select.should.be.instanceof(Function)

    const unsubscribe = observeStore(store, select, propStream.set, opts)

    function detach () {
      unsubscribe()
      dispose()
      isAttached = false
    }
    return detach
  }

  return (
    { attach
    , context: propStream.context
    , get current() { return propStream.current() }
    }
  )
}

