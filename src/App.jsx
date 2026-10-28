import { useState } from 'react';
import './App.css';



function BookForm({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim() === '') return;
    onAdd(title.trim());
    setTitle('');
  };

  return (
    <div className="add-book-row">
      <input
        className="input"
        placeholder="Название книги..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
      />
      <button className="btn" onClick={handleAdd}>Добавить на полку</button>
    </div>
  );
}

function FilterChip({ showOnlyUnread, setShowOnlyUnread }) {
  return (
    <div className="filter-chip">
      <input
        type="checkbox"
        id="filterCheckbox"
        checked={showOnlyUnread}
        onChange={(e) => setShowOnlyUnread(e.target.checked)}
      />
      <label htmlFor="filterCheckbox">
        <span className="dot"></span>
        Только непрочитанные
      </label>
    </div>
  );
}

function BookItem({ book, onToggleRead, onDelete }) {
  const colors = ['#4f6b52', '#8a3a3a', '#3a5a8a', '#8a6a3a', '#5a3a8a'];
  const coverColor = colors[book.id % colors.length];

  return (
    <div className="book-row">
      <div className="book-cover" style={{ backgroundColor: coverColor }}>
        {book.title.charAt(0).toUpperCase()}
      </div>
      <div className="book-info">
        <p className={`book-title ${book.read ? 'done' : ''}`}>{book.title}</p>
        <div className="book-author">Неизвестный автор</div>
      </div>
      <div className={`read-check ${book.read ? 'checked' : ''}`} onClick={() => onToggleRead(book.id)}>
        <span className="check-circle">✓</span>
        <span className="read-label">Прочитано</span>
      </div>
      <button className="delete-btn" onClick={() => onDelete(book.id)}>✕</button>
    </div>
  );
}

function BookList({ books, onToggleRead, onDelete }) {
  if (books.length === 0) {
    return <div className="empty-note">На полке пока нет книг</div>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookItem 
          key={book.id} 
          book={book} 
          onToggleRead={onToggleRead} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}

function ShelfScreen({ books, showOnlyUnread, setShowOnlyUnread, onAdd, onDelete, onToggleRead }) {
  // Фильтрация на лету
  const filteredBooks = showOnlyUnread ? books.filter((b) => !b.read) : books;

  return (
    <section>
      <p className="greeting">Добрый вечер</p>
      <BookForm onAdd={onAdd} />
      <div className="list-toolbar">
        <span className="toolbar-title">Книги</span>
        <FilterChip showOnlyUnread={showOnlyUnread} setShowOnlyUnread={setShowOnlyUnread} />
      </div>
      <BookList books={filteredBooks} onToggleRead={onToggleRead} onDelete={onDelete} />
    </section>
  );
}



function App() {
  const [books, setBooks] = useState([
    { id: 1, title: 'Клара и Солнце', read: true }
  ]);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const handleAdd = (title) => {
    setBooks((prev) => [...prev, { id: Date.now(), title, read: false }]);
  };

  const handleDelete = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const handleToggleRead = (id) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, read: !book.read } : book))
    );
  };

  return (
    <div className="app">
      <div className="app-header">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div className="brand-name">Shelf</div>
        </div>
      </div>
      <ShelfScreen
        books={books}
        showOnlyUnread={showOnlyUnread}
        setShowOnlyUnread={setShowOnlyUnread}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onToggleRead={handleToggleRead}
      />
    </div>
  );
}

export default App;