'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { getLogger } from '@/lib/log'

const logger = getLogger('error-boundary')

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error({
      event: 'ui.error.boundary.caught',
      message: 'ErrorBoundary caught an error',
      error,
      componentStack: errorInfo.componentStack
    })
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <div className="error-boundary__content">
              <h2>Something went wrong</h2>
              <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="axiom-button axiom-button--ghost"
              >
                Try again
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}