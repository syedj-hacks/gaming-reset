// UI-only stand-in for error reporting. The live site forwards handled client
// errors to a monitoring service; here they are just logged to the console.
export function reportClientError(area, error, extra) {
  console.error(`[${area}]`, error, extra)
}
