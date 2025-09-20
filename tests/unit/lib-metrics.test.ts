import { strict as assert } from 'node:assert'
import { performance } from 'node:perf_hooks'
import test from 'node:test'

import { getMetricsSnapshot, incrementMetric, observeMetric, recordDurationMetric, resetMetrics } from '../../lib/metrics'

test('incrementMetric increases counter values deterministically', () => {
  resetMetrics()
  incrementMetric('axiom_metrics_fetch_success_total')
  incrementMetric('axiom_metrics_fetch_success_total', 2)

  const snapshot = getMetricsSnapshot()
  const counter = snapshot.counters.find(item => item.name === 'axiom_metrics_fetch_success_total')

  assert.ok(counter)
  assert.equal(counter?.value, 3)
})

test('observeMetric tracks histogram summaries', () => {
  resetMetrics()
  observeMetric('axiom_metrics_fetch_duration_ms', 10)
  observeMetric('axiom_metrics_fetch_duration_ms', 30)

  const snapshot = getMetricsSnapshot()
  const histogram = snapshot.histograms.find(item => item.name === 'axiom_metrics_fetch_duration_ms')

  assert.ok(histogram)
  assert.equal(histogram?.count, 2)
  assert.equal(histogram?.min, 10)
  assert.equal(histogram?.max, 30)
  assert.equal(histogram?.sum, 40)
})

test('recordDurationMetric captures elapsed time', () => {
  resetMetrics()
  const start = performance.now()
  const simulatedDuration = 12.5
  recordDurationMetric('axiom_metrics_fetch_duration_ms', start, start + simulatedDuration)

  const snapshot = getMetricsSnapshot()
  const histogram = snapshot.histograms.find(item => item.name === 'axiom_metrics_fetch_duration_ms')

  assert.ok(histogram)
  assert.equal(histogram?.count, 1)
  assert.ok(Math.abs((histogram?.sum ?? 0) - simulatedDuration) < 0.001)
})
