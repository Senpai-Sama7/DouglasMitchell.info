type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogPayload {
  event: string
  message?: string
  component?: string
  [key: string]: unknown
}

const redactError = (input: unknown): unknown => {
  if (input instanceof Error) {
    const { name, message, stack, cause } = input
    return {
      name,
      message,
      stack,
      cause: cause instanceof Error ? redactError(cause) : cause
    }
  }

  return input
}

const logWriters: Record<LogLevel, (message?: unknown, ...optional: unknown[]) => void> = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
}

function writeLog(level: LogLevel, component: string, payload: LogPayload) {
  const basePayload = {
    timestamp: new Date().toISOString(),
    level,
    component,
    ...payload
  }

  if ('error' in basePayload) {
    basePayload.error = redactError(basePayload.error)
  }

  const writer = logWriters[level]
  writer(JSON.stringify(basePayload))
}

export function getLogger(component: string) {
  return {
    debug(payload: LogPayload) {
      writeLog('debug', component, payload)
    },
    info(payload: LogPayload) {
      writeLog('info', component, payload)
    },
    warn(payload: LogPayload) {
      writeLog('warn', component, payload)
    },
    error(payload: LogPayload) {
      writeLog('error', component, payload)
    }
  }
}

export type Logger = ReturnType<typeof getLogger>
