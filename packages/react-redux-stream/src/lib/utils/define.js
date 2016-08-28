const strictAttributes = (
  { __proto__: null
  , enumerable: false
  , configurable: false
  }
)

/** Defines a property on an object with strict privatish defaults. */
export function strictProperty(target, propertyKey, attributes, flags = {}) {
  const result = Reflect.defineProperty(target, propertyKey, { ...strictAttributes, ...attributes })
  if(flags.pipe && target !== 'undefined')
    return target[propertyKey]
  return result
}

/** Defines a property on an object with strict privatish defaults. */
export function symbolProperties(target, symbols, flags = {}) {
  return Object.entries(symbols).reduce((_target, [symbolKey, value]) => {
    const result = define.strictProperty(_target, symbolKey, { value }, { pipe: true })
    if(flags.throws && !result)
      throw new TypeError(`Could not assign strict property to target type "${typeof _target}"`)
    return _target
  }, target)
}
