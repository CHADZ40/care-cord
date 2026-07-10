export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

// Express recognizes this as an error handler because it has 4 params.
export function errorHandler(err, req, res, _next) {
  const status = err.status ?? 500
  const payload = {
    error: err.message || 'Something went wrong on the server.'
  }
  if (err.details) payload.details = err.details
  if (status === 500) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
  res.status(status).json(payload)
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` })
}
