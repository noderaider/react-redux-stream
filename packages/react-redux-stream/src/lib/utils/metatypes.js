import * as symbols from './symbols'
import * as define from './define'

const noop = () => {}

const symbolRegistry = (
  { __proto__: null
  , type: symbols.type
  , rootType: symbols.rootType
  , genericType: symbols.genericType
  , genericTypes: symbols.genericTypes
  , instanceType: symbols.instanceType
  }
)
const symbolEntries = Object.entries(symbolRegistry)

export const reflect = Object.freeze (
  Object.assign( x => symbolEntries.reduce(
    (reduction, [ name, symbol ]) => {
      const value = x[symbol]
      if(typeof value === 'undefined')
        return reduction
      return { ...reduction, [name]: symbol }
    }, {})
  , symbolEntries.reduce((reduction, [ name, symbol ]) => ({ ...reduction, [name]: x => x[symbol] }), {})
  )
)

/** Factory that imbues objects with symbol type information and type utils. */
export default function metaTypes (rootTypeName, ...genericTypeNames) {
  const genericTypeName = genericTypeNames.length > 0 ? genericTypeNames.join(',') : noop()
  const typeName = `${rootTypeName}${genericTypeName ? `<${genericTypeName}>` : ''}`

  const typedProps = (
    { [symbols.type]: typeName
    , [symbols.rootType]: typeName
    , [symbols.genericType]: genericTypeName
    , [symbols.genericTypes]: genericTypeNames
    }
  )

  const namedProps = reflect(typedProps)

  const flags = Object.freeze(
    { get generic() { return typeof genericTypeName !== 'undefined' }
    }
  )

  const iterableHas = testName => (
    { genericTypes: (...x) => x[testName](y => genericTypes.includes(y))
    , genericTypeNames: (...x) => x[testName](y => genericTypeNames.includes(y))
    }
  )

  const is = Object.freeze (
    { type: x => x[symbols.type] === typeName
    , rootType: x => x[symbols.rootType] === rootTypeName
    , genericType: x => x[symbols.genericType] === genericType
    , genericTypeName: x => x === genericTypeName
    }
  )

  const has = Object.freeze (
    { all: iterableHas('every')
    , any: iterableHas('some')
    }
  )

  const utils = Object.freeze(
    { __proto__: null
    , typedProps
    , ...namedProps
    , flags
    , reflect
    , is
    , has
    , imbue: target => define.symbolProperties(target, typedProps)
    }
  )

  const instance = function (...path) {
    return (
      { __proto__: null
      , ...typedProps
      , [symbols.instanceType]: path.reduce((reduction, x) => `${reduction}#${x}`, 'instance')
      }
    )
  }

  return Object.freeze(Object.assign(instance, utils))
}
