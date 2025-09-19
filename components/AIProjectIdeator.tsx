'use client'

import { useMemo, useState } from 'react'

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

  const pillarMap = useMemo(() => new Map(pillars.map(pillar => [pillar.category, pillar])), [pillars])
  const skillMap = useMemo(() => new Map(skills.map(skill => [skill.category, skill])), [skills])

  function handleGenerate() {
    const pillar = pillarMap.get(selectedPillar)
    const skill = skillMap.get(selectedSkill)

    if (!pillar || !skill) {
      setConcept('Select both a narrative pillar and a skill domain to ideate.')
      return
    }

    const prompt = pillar.prompts[0]
    const proof = skill.proofs[0]

    setConcept(
      `${pillar.category}: Prototype a system that ${prompt?.toLowerCase()}. Anchor it in the ${skill.category.toLowerCase()} discipline by leveraging ${proof.toLowerCase()}. Document validation checkpoints and community impact metrics before shipping.`
    )
  }

  return (
    <section className="ideator" aria-labelledby="ai-ideator-heading">
      <div className="ideator-controls">
        <label>
          Narrative pillar
          <select value={selectedPillar} onChange={event => setSelectedPillar(event.target.value)}>
            {pillars.map(pillar => (
              <option key={pillar.category} value={pillar.category}>
                {pillar.category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Skill focus
          <select value={selectedSkill} onChange={event => setSelectedSkill(event.target.value)}>
            {skills.map(skill => (
              <option key={skill.category} value={skill.category}>
                {skill.category}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleGenerate} className="button">
          Generate concept
        </button>
      </div>
      <output className="ideator-output" id="ai-ideator-heading">
        {concept}
      </output>
    </section>
  )
}
