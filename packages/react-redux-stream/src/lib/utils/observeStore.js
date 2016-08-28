import * as define from './define'
import stats from './stats'
const should = require('chai').should()

/** Observes redux store and pushes changes triggering a different state selection value */
function observeStore(store, select, onChange) {
  should.exist(store)
  should.exist(select)
  should.exist(onChange)
  select.should.be.instanceof(Function)
  onChange.should.be.instanceof(Function)
  let currentState

  const counts = { observed: 0, skipped: 0 }

  function handleChange() {
    counts.change++
    let nextState = select(store.getState())
    if (nextState === currentState)
      return counts.skipped++

    stats('observe', { ...counts, saved: counts.observed - counts.skipped })
    currentState = nextState
    onChange(currentState)
  }

  let unsubscribe = store.subscribe(handleChange)
  handleChange()
  define.strictProperty(store.subscribe(handleChange), )
  return unsubscribe
}
