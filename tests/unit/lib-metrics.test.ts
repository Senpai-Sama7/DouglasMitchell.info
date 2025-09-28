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

test('histogram assertions with multiple observations', () => {
  resetMetrics()

  // Record multiple observations
  observeMetric('test_histogram_metric', 100)
  observeMetric('test_histogram_metric', 200)
  observeMetric('test_histogram_metric', 50)
  observeMetric('test_histogram_metric', 300)

  const snapshot = getMetricsSnapshot()
  const histogram = snapshot.histograms.find(item => item.name === 'test_histogram_metric')

  assert.ok(histogram, 'Histogram should exist')
  assert.equal(histogram.count, 4, 'Should have 4 observations')
  assert.equal(histogram.min, 50, 'Minimum should be 50')
  assert.equal(histogram.max, 300, 'Maximum should be 300')
  assert.equal(histogram.sum, 650, 'Sum should be 650')

  // Calculate average manually since histogram doesn't include avg property
  const calculatedAvg = histogram.sum / histogram.count
  assert.equal(calculatedAvg, 162.5, 'Average should be 162.5')
})

test('multiple metrics can coexist', () => {
  resetMetrics()

  // Create different types of metrics
  incrementMetric('counter_a', 5)
  incrementMetric('counter_b', 3)
  observeMetric('histogram_a', 10)
  observeMetric('histogram_b', 20)

  const snapshot = getMetricsSnapshot()

  assert.equal(snapshot.counters.length, 2, 'Should have 2 counters')
  assert.equal(snapshot.histograms.length, 2, 'Should have 2 histograms')

  const counterA = snapshot.counters.find(c => c.name === 'counter_a')
  const counterB = snapshot.counters.find(c => c.name === 'counter_b')
  const histogramA = snapshot.histograms.find(h => h.name === 'histogram_a')
  const histogramB = snapshot.histograms.find(h => h.name === 'histogram_b')

  assert.equal(counterA?.value, 5)
  assert.equal(counterB?.value, 3)
  assert.equal(histogramA?.sum, 10)
  assert.equal(histogramB?.sum, 20)
})
