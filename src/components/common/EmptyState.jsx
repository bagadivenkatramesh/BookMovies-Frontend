export default function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {text ? <p className="muted">{text}</p> : null}
      {action ? <div className="mt-lg">{action}</div> : null}
    </div>
  )
}
