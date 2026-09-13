import Spinner from './Spinner'
import EmptyState from './EmptyState'
import ErrorBanner from './ErrorBanner'

export default function PageState({
  loading,
  error,
  onRetry,
  empty,
  emptyTitle = 'Nothing to show yet',
  emptyText,
  emptyAction,
  children,
}) {
  if (loading) {
    return <Spinner />
  }
  if (error) {
    return <ErrorBanner message={error} onRetry={onRetry} />
  }
  if (empty) {
    return <EmptyState title={emptyTitle} text={emptyText} action={emptyAction} />
  }
  return children
}
