import rewire from 'rewire'
const should = require('chai').should()

describe('lib', function() {
  const lib = rewire('../lib')

  describe('#default', function () {
    it('should have default export', () => should.exist(lib.default))
  })

  const Stream = lib.default
  describe('Stream', function () {
    it('should be a function', () => Stream.should.be.a('function'))
    it('should be named', () => Stream.name.should.equal('Stream'))
    it('should not throw', () => (() => Stream()).should.not.throw())
    it('should return an object', () => Stream().should.be.an('object'))
  })
})
