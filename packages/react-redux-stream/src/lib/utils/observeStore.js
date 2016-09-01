import * as define from './define'
import stats from './stats'
const should = require('chai').should()

/** Observes redux store and pushes changes triggering a different state selection value */
export default function observeStore(store, select, onChange) {
  should.exist(store)
  should.exist(select)
  should.exist(onChange)
  select.should.be.instanceof(Function)
  onChange.should.be.instanceof(Function)
  let currentState

  const counts = {}
  const resetCounts = () => {
    counts.observed = 0
    counts.bypassed = 0
  }
  const observe = () => { counts.observed++ }
  const bypass = () => { counts.bypassed++ }
  resetCounts()


  function handleChange() {
    observe()
    let nextState = select(store.getState())
    if (nextState === currentState)
      return bypass()

    currentState = nextState
    stats(`react-redux-stream: ${JSON.stringify(counts)}`, currentState)
    resetCounts()
    onChange(currentState)
  }

  let unsubscribe = store.subscribe(handleChange)
  handleChange()
  return unsubscribe
}
