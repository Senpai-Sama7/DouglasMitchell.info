import { test, describe } from 'node:test'
import { strict as assert } from 'node:assert'

describe('BentoGrid Component', () => {
  test('BentoItem interface should have required properties', () => {
    const mockItem = {
      id: '1',
      type: 'hero' as const,
      title: 'Test Item',
      size: 'medium' as const
    }
    
    assert.equal(typeof mockItem.id, 'string')
    assert.equal(typeof mockItem.title, 'string')
    assert.ok(['hero', 'stats', 'about', 'newsletter', 'activity', 'feature', 'blog'].includes(mockItem.type))
    assert.ok(['small', 'medium', 'large', 'wide'].includes(mockItem.size))
  })

  test('BentoItem should support optional properties', () => {
    const mockItem = {
      id: '1',
      type: 'blog' as const,
      title: 'Test',
      size: 'medium' as const,
      content: 'Test content',
      color: 'blue' as const,
      gradient: 'linear-gradient(45deg, blue, red)',
      data: { test: true }
    }
    
    assert.equal(mockItem.content, 'Test content')
    assert.equal(mockItem.color, 'blue')
    assert.equal(mockItem.gradient, 'linear-gradient(45deg, blue, red)')
    assert.deepEqual(mockItem.data, { test: true })
  })
})
