import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Funnel, SquareDashed, List, Pencil, Trash2 } from 'lucide-react';
import {
  fetchNotesWithSentiment,
  createNote,
  updateNote,
  deleteNote,
} from './notes.api';
import { getSentimentColor, getSentimentEmoji } from './notes.utils';
import { SENTIMENT_OPTIONS } from '../../constants';

const Notes = () => {
  const [viewMode, setViewMode] = useState('card');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const result = await fetchNotesWithSentiment(token);
    setNotes(result);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    try {
      selectedNote?._id
        ? await updateNote(selectedNote._id, editTitle, editContent, token)
        : await createNote(editTitle, editContent, token);

      resetForm();
      loadNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    }
  };

  const resetForm = () => {
    setSelectedNote(null);
    setEditTitle('');
    setEditContent('');
    setIsEditing(false);
  };

  const filteredNotes =
    filter.length === 0
      ? notes
      : notes.filter((n) => filter.includes(n.sentiment)) || [];

  return (
    <>
      {/* Modal */}
      {(selectedNote || isEditing) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-gray-800 dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-2xl relative">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-semibold text-center w-full">
                {selectedNote?._id ? 'Edit Note' : 'Add Note'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                ✖
              </button>
            </div>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                required
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content (min 10 characters)"
                className="w-full h-100 p-2 border rounded dark:bg-gray-700 dark:text-white"
                minLength={10}
                required
              />
              <div className="flex justify-end gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save
                </button>
                <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-800">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl mr-auto">My Notes</h1>
          <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
        <div className='relative ml-auto'>
          <button
            onClick={() => {
              setSelectedNote({});
              setIsEditing(true);
              setEditTitle('');
              setEditContent('');
            }}
            className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Note
          </button>
        </div>
        <div className="mb-6 flex flex-wrap justify-between items-start gap-6">
          <div className="realtive ml-auto self-anchor-center flex border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden" style={{alignSelf: 'anchor-center'}}>
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 flex items-center gap-2 text-sm transition-all duration-200 rounded-l-full ${viewMode === 'card'
                ? 'bg-green-100 text-green-700 dark:bg-blue-600 dark:text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
            >
              <SquareDashed size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 flex items-center gap-2 text-sm transition-all duration-200 rounded-r-full ${viewMode === 'list'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                style={{alignSelf: 'anchor-center'}}
            >
              <List size={16} />
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              disabled={notes.length === 0}
            >
              <Funnel className="w-4 h-4" /> Filter
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 z-10 bg-white dark:bg-gray-800 border rounded shadow p-3 w-60">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Select Sentiments
                </label>
                {SENTIMENT_OPTIONS.map((option) => (
                  <label key={option} className="inline-flex items-center gap-2 w-full text-sm text-gray-700 dark:text-gray-200">
                    <input
                      type="checkbox"
                      value={option}
                      checked={filter.includes(option)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFilter((prev) =>
                          checked ? [...prev, option] : prev.filter((val) => val !== option)
                        );
                      }}
                      className={`
                        h-5 w-5 rounded border-gray-300 text-blue-600 
                        transition-all duration-200 ease-in-out transform 
                        focus:ring-2 focus:ring-blue-500
                        checked:scale-110
                        hover:scale-105
                        dark:bg-gray-800 dark:border-gray-600 dark:checked:bg-blue-600
                      `}
                    />
                    <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes Display */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid" data-testid="spinner"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold mb-4">No Notes Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start capturing your thoughts, ideas, and inspirations all in one place.</p>
          </div>
        ) : (
          <div className={`transition-all duration-300 ${viewMode === 'card' ? 'grid gap-6 sm:grid-cols-2 md:grid-cols-3' : 'flex flex-col gap-6'}`}>
            {filteredNotes.map((note) => (
              <div key={note._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  {note.sentiment && (
                    <span className={`text-xl ${getSentimentColor(note.sentiment)}`}>
                      {getSentimentEmoji(note.sentiment)}
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedNote(note);
                      setEditTitle(note.title);
                      setEditContent(note.content);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    title="Edit"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await deleteNote(note._id, token);
                        toast.success('Note deleted');
                        loadNotes();
                      } catch (err) {
                        console.error(err)
                        toast.error('Failed to delete');
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                    title="Delete"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notes;
