import rewire from 'rewire'
const should = require('chai').should()

describe('lib', function() {
  const lib = rewire('../lib')

  describe('#default', function () {
    it('should have default export', () => should.exist(lib.default))
  })

  const proto = { __proto__: null
                , symbols: { unique: Symbol('unique')
                }
                }

  const state = (
    { __proto__: { __proto__: null, i: 0 }
    , stringKey: 'string-key'
    , _: { unique: Symbol('unique') }
    , get unique() { this.i++ }
    }
  )

  const bag = { get uniqueStringKey () { return `${stringKey}-${_state.unique++}` }
              }

  const Stream = lib.default
  describe('Stream', function () {
    it('should be a function', () => Stream.should.be.a('function'))
    it('should be named', () => Stream.name.should.equal('Stream'))
    it('should throw with no args', () => (() => Stream()).should.throw())
    it('should throw with one arg', () => (() => Stream('key')).should.throw())
    it('should accept symbol key', () => Stream(Symbol('key')).should.be.an('object'))
  })
})
