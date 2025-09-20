import { strict as assert } from 'node:assert'
import test from 'node:test'

import { getProjectBySlug, getProjectStaticParams, ProjectNotFoundError } from '../../lib/projects'

test('getProjectBySlug returns a project for a known slug', () => {
  const project = getProjectBySlug('ultimate-ai-agent')

  assert.equal(project.id, 'ultimate-ai-agent')
  assert.equal(project.slug, 'ultimate-ai-agent')
  assert.ok(project.title.length > 0)
})

test('getProjectBySlug throws ProjectNotFoundError for unknown slug', () => {
  assert.throws(() => getProjectBySlug('unknown-slug'), ProjectNotFoundError)
})

test('getProjectStaticParams lists all project slugs', () => {
  const params = getProjectStaticParams()
  const found = params.find(param => param.slug === 'ultimate-ai-agent')

  assert.ok(found)
  assert.ok(params.length >= 5)
})
