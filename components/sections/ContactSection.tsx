'use client'

import { memo, useId } from 'react'
import { contactChannels } from '@/content/site-data'

export const ContactSection = memo(function ContactSection() {
  const nameId = useId()
  const emailId = useId()
  const contextId = useId()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    const context = formData.get('context')

    const subject = encodeURIComponent('Contact from douglasmitchell.info')
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${context}`)

    window.location.href = `mailto:${contactChannels.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" className="axiom-section axiom-section--contact">
      <div className="axiom-section__inner">
        <header className="axiom-section__header">
          <p className="axiom-eyebrow">Contact</p>
          <h2 className="axiom-heading">Bring the next dispatch to life.</h2>
          <p className="axiom-body">
            The portal routes straight to Douglas. Expect a response inside 48 hours with integration notes and validation pathways.
          </p>
        </header>
        <form className="axiom-form" onSubmit={handleSubmit} noValidate>
          <div className="axiom-form__group">
            <input 
              id={nameId}
              name="name" 
              type="text" 
              placeholder=" " 
              required 
              aria-describedby={`${nameId}-hint`}
              autoComplete="name"
            />
            <label htmlFor={nameId}>Name</label>
            <span id={`${nameId}-hint`} className="axiom-form__hint">Who should I coordinate with?</span>
          </div>
          <div className="axiom-form__group">
            <input 
              id={emailId}
              name="email" 
              type="email" 
              placeholder=" " 
              required 
              aria-describedby={`${emailId}-hint`}
              autoComplete="email"
            />
            <label htmlFor={emailId}>Email</label>
            <span id={`${emailId}-hint`} className="axiom-form__hint">Replies land within 48 hours.</span>
          </div>
          <div className="axiom-form__group axiom-form__group--full">
            <textarea 
              id={contextId}
              name="context" 
              placeholder=" " 
              rows={4} 
              required 
              aria-describedby={`${contextId}-hint`}
              autoComplete="off"
            />
            <label htmlFor={contextId}>Mission brief</label>
            <span id={`${contextId}-hint`} className="axiom-form__hint">Share goals, scope, timeline, and Neon requirements.</span>
          </div>
          <div className="axiom-form__actions">
            <button type="submit" className="axiom-button axiom-button--primary" data-loading-text="Sending…">
              Initiate contact
            </button>
          </div>
          <p className="axiom-form__footnote">Privacy-first analytics. Secrets stored in secure vaults. Reversible delivery guaranteed.</p>
        </form>
      </div>
    </section>
  )
})