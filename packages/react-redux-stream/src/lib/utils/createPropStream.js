import EventEmitter from 'eventemitter3'
import * as define from './define'
import * as symbols from './symbols'
import metaTypes from './metatypes'
const should = require('chai').should()

/**
 * Injects a private streamed value as a getter only property of one or more contexts.
 * @param  {string} publicKey     The getter property name of the target context.
 * @param  {Object} sharedContext An optional shared context to sync (useful for globals and debugging).
 * @return {Object}               An object with controls for attaching and streaming to contexts.
 */
export default function createPropStream (publicKey, sharedContext = {}) {
  let _value
  let metaType = metaTypes('propStream', publicKey)


  let _contexts = [ sharedContext ]

  const EE = new EventEmitter()
  const flags = Object.freeze({ get listening() { return EE.listeners(symbols.set).length > 0 } })


  function set (value) {
    console.warn('SET VALUE', publicKey, value)
    should.exist(value, 'value must exist to set in stream')
    EE.emit(symbols.set, value)
    return value
  }

  function listener (value) {
    console.warn('LISTENER', publicKey, value)
    if(_contexts.some(x => x === undefined || x === null))
      console.warn('Context does not exist, you may not be cleaning up resources')
    should.exist(value, 'incoming prop stream value must exist')
    _value = value
  }

  function listen () {
    console.warn('LISTEN', publicKey)
    EE.listeners(symbols.set).length.should.equal(0, 'Max of one listener allowed per prop stream')
    EE.on(symbols.set, listener)
    return dispose
  }

  function dispose () {
    console.warn('DISPOSE', publicKey)
    EE.listeners(symbols.set).length.should.equal(1, 'No listener running on prop stream. Did you forget to call listen?')
    EE.removeListener(symbols.set, listener)
    return listen
  }

  function context(_context, requireValue = false) {
    console.warn('CONTEXT', publicKey, _context, requireValue)
    if(requireValue) should.exist(_value, 'value must be set prior to stream creation')
    define.strictProperty(_context, publicKey, { get() { return _value } }).should.be.true

    define.symbolProperties(_context, metaType('context', _contexts.length))
    _contexts.push(_context)
    return _context
  }

  console.warn('SINGLETON', publicKey)
  return Object.freeze( { ...metaType.typedProps
                        , set
                        , context
                        , listen
                        , dispose
                        , flags
                        , sharedContext: context(sharedContext)
                        , get contexts() { return _contexts }
                        , current: () => {
                            if(_value === undefined)
                              console.trace('prop stream must have a value set prior to polling current value')
                            return _value
                          }
                        })
}

