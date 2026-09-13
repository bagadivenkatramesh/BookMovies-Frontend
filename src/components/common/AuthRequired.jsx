import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from './Spinner'
import EmptyState from './EmptyState'

export default function AuthRequired({
  children,
  title = 'Sign in to continue',
  text = 'This data is served by authenticated backend endpoints.',
}) {
  const { isAuthenticated, authLoading } = useAuth()

  if (authLoading) {
    return <Spinner label="Checking your session…" />
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        title={title}
        text={text}
        action={
          <Link className="btn" to="/login">
            Sign in
          </Link>
        }
      />
    )
  }

  return children
}
