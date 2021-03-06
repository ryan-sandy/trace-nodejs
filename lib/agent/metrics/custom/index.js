var debug = require('debug')('risingstack/trace')

var Timer = require('../../timer')

function CustomMetrics (options) {
  this.name = 'Metrics/Custom'
  var _this = this
  this.collectorApi = options.collectorApi
  this.config = options.config
  this.collectInterval = this.config.collectInterval

  this.incrementMetrics = {}
  this.recordMetrics = {}

  this.timer = new Timer(function () {
    _this.sendMetrics()
  }, this.collectInterval)
}

CustomMetrics.prototype.increment = function (name, amount) {
  if (!name) {
    throw new Error('Name is needed for CustomMetrics.increment')
  }
  amount = amount || 1
  if (this.incrementMetrics[name]) {
    this.incrementMetrics[name] += amount
  } else {
    this.incrementMetrics[name] = amount
  }
}

CustomMetrics.prototype.record = function (name, value) {
  if (!name) {
    throw new Error('Name is needed for CustomMetrics.record')
  }
  if (typeof value === 'undefined') {
    throw new Error('Name is needed for CustomMetrics.record')
  }

  if (this.recordMetrics[name]) {
    this.recordMetrics[name].push(value)
  } else {
    this.recordMetrics[name] = [value]
  }
}

CustomMetrics.prototype.sendMetrics = function () {
  this.collectorApi.sendCustomMetrics({
    incrementMetrics: this.incrementMetrics,
    recordMetrics: this.recordMetrics
  })

  this.incrementMetrics = {}
  this.recordMetrics = {}
}

function create (options) {
  return new CustomMetrics(options)
}

module.exports.create = create
