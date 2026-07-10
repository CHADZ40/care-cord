/**
 * Wraps an async Express handler so any thrown error / rejected promise
 * is forwarded to next() instead of crashing the process or hanging the request.
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
