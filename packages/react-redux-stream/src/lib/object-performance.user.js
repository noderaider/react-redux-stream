function profile () {
  function test ( name
                , define
                , construct
                , { index = 0
                  , count = 10000
                  , ordinals = [ 0, 1 ]
                  , constructPrior = false
                  } = {}
                ) {
    performance.clearMarks()
    performance.clearMeasures()
    const symbols = { type: Symbol('type') }
    const marks = (
      { __proto__: null
      , start: `${name}_start`
      , define: `${name}_define`
      , construct: `${name}_construct`
      , end: `${name}_end`
      }
    )

    performance.mark(marks.start)
    let Type = define()
    performance.mark(marks.define)

    let obj = constructPrior ? construct(Type) : null
    do {
      if(!constructPrior)
        obj = construct(Type)
      if(index === 0)
        performance.mark(marks.construct)

      const measureOrdinal = ordinals.includes(index)
      if(measureOrdinal)
          performance.mark(`${name}_ordinal_${index}_pre`)

      obj.message('hi')
      obj.addition(index, 2)

      if(measureOrdinal)
        performance.mark(`${name}_ordinal_${index}_post`)
    } while (++index < count)
    performance.mark(marks.end)

    const measureMarks = Object.assign (
      { [`${name}_define`]: [ marks.start, marks.define ]
      , [`${name}_construct`]: [ marks.define, marks.construct ]
      , [`${name}_loop`]: [ marks.construct, marks.end ]
      , [`${name}_total`]: [ marks.start, marks.end ]
      }
    , ordinals.reduce((reduction, i) => Object.assign(reduction, { [`${name}_ordinal_${i}`]: [ `${name}_ordinal_${i}_pre`, `${name}_ordinal_${i}_post` ] }), {})
    )

    Object.keys(measureMarks).forEach((key) => performance.measure(key, ...measureMarks[key]))

    const measures = performance.getEntriesByType('measure').map(x => Object.assign(x, { endTime: x.startTime + x.duration }))
    measures.sort((a, b) => a.endTime - b.endTime)
    const durations = measures.reduce((reduction, measure) => Object.assign(reduction, { [measure.name]: measure.duration }), {})

    return (
      { [symbols.type]: 'profile'
      , profile: name
      , duration: durations[`${name}_total`]
      , durations
      , measures
      }
    )
  }

  const refs = (
    { __proto__: null
    , message: function(s) { var mymessage = s + '' }
    , addition: function(i, j) { return (i *2 + j * 2) / 2 }
    }
  )

  const testArgs = [
    [ 'constructor'
    , function define() {
        return function Type () {
          this.message = refs.message
          this.addition = refs.addition
        }
      }
    , function construct(Type) {
        return new Type()
      }
    ]
  , [ 'prototype'
    , function define() {
        function Type () {
        }
        Type.prototype.message = refs.message
        Type.prototype.addition = refs.addition
        return Type
      }
    , function construct(Type) {
        return new Type()
      }
    ]
  , [ 'create'
    , function define() {
        return (
          { __proto__: null
          , message: refs.message
          , addition: refs.addition
          }
        )
      }
    , function construct(Type) {
        return Object.create(Type)
      }
    ]
  ]

  return testArgs.reduce(
    (reduction, [ name, ...args ]) => (
      Object.assign( reduction
      , { [name]: (
            { normal: test(name, ...args, { constructPrior: true })
            , reconstruct: test(`${name}_reconstruct`, ...args, { constructPrior: false })
            }
          )
        }
      )
    )
  , {})
}

const profiled = profile()

const breakdown = Object.keys(profiled)
  .reduce((reduction, name) => [ ...reduction, ...Object.keys(profiled[name]).reduce((r, type) => [ ...r, { profile: `${name}_${type}`, duration: profiled[name][type].duration } ], []) ], [])

