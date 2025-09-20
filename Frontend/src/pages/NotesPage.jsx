import { useEffect, useState } from 'react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/notes', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotes(data);
        } else {
          setNotes([]); // fallback to empty array
          setError(data.message || 'Failed to load notes');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load notes');
        setLoading(false);
      });
  }, []);

  const addNote = () => {
    if (title.trim() || content.trim()) {
      fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim() || 'Untitled',
          content: content.trim(),
        }),
      })
        .then(res => res.json().then(data => ({ status: res.status, data })))
        .then(({ status, data }) => {
          if (status === 403 && data.message && data.message.includes('Free plan limit')) {
            setShowLimitModal(true);
          } else if (status >= 400) {
            setError(data.message || 'Failed to create note');
          } else {
            setNotes([data, ...notes]);
            setTitle('');
            setContent('');
          }
        })
        .catch(() => setError('Failed to create note'));
    }
  };
  const deleteNote = (id) => {
    fetch(`http://localhost:5000/api/notes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete note');
        setNotes(notes.filter(note => note._id !== id));
      })
      .catch(() => setError('Failed to delete note'));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (loading) return <div className="text-center py-16">Loading notes...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-6 py-8 ">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent mb-4">
            My Notes
          </h1>
          <p className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Capture your thoughts and ideas</p>
        </div>

        {/* Note Creation Form */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border/50 mb-8 bg-white">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Create New Note</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full px-4 py-3 bg-input/50 border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note content here..."
                rows={6}
                className="w-full px-4 py-3 bg-input/50 border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none"
              />
            </div>

            <button
              onClick={addNote}
              className="w-full bg-blue-500 text-white font-semibold py-4 px-6 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Add New Note
            </button>
          </div>
        </div>

        {/* Notes List */}

        <div className="space-y-6 ">
          {notes.length === 0 ? (
            <div className="text-center py-16 ">
              <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-muted-foreground text-lg">No notes yet. Create your first note above!</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Your Notes ({notes.length})
              </h3>
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white backdrop-blur-sm rounded-3xl p-6 shadow-md border border-border/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {note.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-destructive/50"
                    >
                      Delete Note
                    </button>
                  </div>

                  {note.content && (
                    <div className="bg-secondary/30 rounded-2xl p-4 mt-4">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {showLimitModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-40">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
      <h2 className="text-xl font-bold mb-4 text-red-600">Note Limit Reached</h2>
      <p className="mb-6 text-gray-700">
        You’ve reached the 3-note limit for the Free plan.<br />
        Upgrade to Pro for unlimited notes!
      </p>
      <button
        onClick={() => setShowLimitModal(false)}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Notes;