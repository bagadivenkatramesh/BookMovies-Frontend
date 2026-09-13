import Alert from './Alert'
import { Button } from './Button'

export default function ErrorBanner({ message, onRetry }) {
  if (!message) {
    return null
  }
  return (
    <div className="stack">
      <Alert type="error">{message}</Alert>
      {onRetry ? (
        <div>
          <Button type="button" variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  )
}
