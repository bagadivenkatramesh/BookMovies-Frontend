export default function MovieFilters({
  title,
  genre,
  language,
  onTitleChange,
  onGenreChange,
  onLanguageChange,
  onSubmit,
  onReset,
}) {
  return (
    <form className="filters" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="movie-title">Title</label>
        <input
          id="movie-title"
          className="input"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Search by movie title"
        />
      </div>
      <div className="field">
        <label htmlFor="movie-genre">Genre</label>
        <input
          id="movie-genre"
          className="input"
          value={genre}
          onChange={(event) => onGenreChange(event.target.value)}
          placeholder="e.g. Action"
        />
      </div>
      <div className="field">
        <label htmlFor="movie-language">Language</label>
        <input
          id="movie-language"
          className="input"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          placeholder="e.g. Hindi"
        />
      </div>
      <div className="field" style={{ justifyContent: 'end' }}>
        <label>&nbsp;</label>
        <div className="btn-row">
          <button className="btn" type="submit">
            Filter
          </button>
          <button className="btn-secondary" type="button" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </form>
  )
}
