var x, y, z

const X = function() {}
X.prototype.message = function(s) { var mymessage = s + '' }
X.prototype.addition = function(i, j) { return (i *2 + j * 2) / 2 }

const Y = function() {
    this.message = function(s) { var mymessage = s + '' }
    this.addition = function(i, j) { return (i *2 + j * 2) / 2 }
}

const Z = (
  { message: function(s) { var mymessage = s + ''}
  , addition: function(i, j) { return (i *2 + j * 2) / 2 }
  }
)

const F = (
  { __proto__: null
  , message: function(s) { var mymessage = s + ''}
  , addition: function(i, j) { return (i *2 + j * 2) / 2 }
  }
)

function test ( name
              , construct
              , { index = 0, count = 10000 } = {}
              ) {
  var subject = construct()
  while(index++ < count) {

  }
}

function TestPerformance()
{
  var closureStartDateTime = new Date()
  for (var i = 0; i < 100000; i++)
  {
 y = new Y()
    y.message('hi')
    y.addition(i, 2)
  }
  var closureEndDateTime = new Date()

  var prototypeStartDateTime = new Date()
  for (var i = 0; i < 100000; i++)
  {
    x = new X()
    x.message('hi')
    x.addition(i, 2)
  }
  var prototypeEndDateTime = new Date()

  var staticObjectStartDateTime = new Date()
  for (var i = 0; i < 100000; i++)
  {
 z = Z // obviously you don't really need this
    z.message('hi')
    z.addition(i, 2)
  }


  var staticObjectEndDateTime = new Date()
  var closureTime = closureEndDateTime.getTime() - closureStartDateTime.getTime()
  var prototypeTime = prototypeEndDateTime.getTime() - prototypeStartDateTime.getTime()
  var staticTime = staticObjectEndDateTime.getTime() - staticObjectStartDateTime.getTime()
  console.info({ closureTime, prototypeTime, staticTime })
}

TestPerformance()
