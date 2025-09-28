'use client'

import { useId, useMemo, useState } from 'react'

type Pillar = {
  category: string
  description: string
  prompts: string[]
}

type SkillProof = {
  category: string
  description: string
  proofs: string[]
}

export function AIProjectIdeator({
  pillars,
  skills
}: {
  pillars: Pillar[]
  skills: SkillProof[]
}) {
  const [selectedPillar, setSelectedPillar] = useState(pillars[0]?.category ?? '')
  const [selectedSkill, setSelectedSkill] = useState(skills[0]?.category ?? '')
  const [concept, setConcept] = useState('Select a focus and generate a concept.')
  const [isGenerating, setIsGenerating] = useState(false)

  const pillarMap = useMemo(() => new Map(pillars.map(pillar => [pillar.category, pillar])), [pillars])
  const skillMap = useMemo(() => new Map(skills.map(skill => [skill.category, skill])), [skills])

  const sectionHeadingId = useId()
  const conceptHeadingId = useId()

  const getRandomEntry = (items: string[]): string | undefined => {
    if (!items.length) return undefined
    const randomIndex = Math.floor(Math.random() * items.length)
    return items[randomIndex]
  }

  function handleGenerate() {
    setIsGenerating(true)
    const pillar = pillarMap.get(selectedPillar)
    const skill = skillMap.get(selectedSkill)

    if (!pillar || !skill) {
      setConcept('Select both a narrative pillar and a skill domain to ideate.')
      setIsGenerating(false)
      return
    }

    const prompt = getRandomEntry(pillar.prompts)
    const proof = getRandomEntry(skill.proofs)

    const narrative = prompt ? prompt.toLowerCase() : 'extend the existing portfolio capabilities'
    const validation = proof ? proof.toLowerCase() : 'evidence-led experimentation'

    setConcept(
      `${pillar.category}: Prototype a system that ${narrative}. Anchor it in the ${skill.category.toLowerCase()} discipline by leveraging ${validation}. Document validation checkpoints, ship a minimum delightful outcome, and capture community impact metrics before launch.`
    )
    setIsGenerating(false)
  }

  return (
    <section className="ideator" aria-labelledby={sectionHeadingId}>
      <header className="ideator-header">
        <h3 id={sectionHeadingId}>AI Project Ideator</h3>
        <p className="meta">Blend narrative pillars and skill domains to conjure a new experiment.</p>
      </header>
      <div className="ideator-controls">
        <label htmlFor={`${sectionHeadingId}-pillar`}>
          Narrative pillar
          <select
            id={`${sectionHeadingId}-pillar`}
            value={selectedPillar}
            onChange={event => setSelectedPillar(event.target.value)}
          >
            {pillars.map(pillar => (
              <option key={pillar.category} value={pillar.category}>
                {pillar.category}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${sectionHeadingId}-skill`}>
          Skill focus
          <select
            id={`${sectionHeadingId}-skill`}
            value={selectedSkill}
            onChange={event => setSelectedSkill(event.target.value)}
          >
            {skills.map(skill => (
              <option key={skill.category} value={skill.category}>
                {skill.category}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleGenerate}
          className="axiom-button axiom-button--inline"
          disabled={isGenerating}
          aria-busy={isGenerating}
        >
          {isGenerating ? 'Generating…' : 'Generate concept'}
        </button>
      </div>
      <div className="ideator-output" role="status" aria-live="polite" aria-labelledby={conceptHeadingId}>
        <p id={conceptHeadingId} className="kicker">
          Concept
        </p>
        <p>{concept}</p>
      </div>
    </section>
  )
}
