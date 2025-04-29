import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContact, getContacts, updateContact, deleteContact, searchContacts, setAuthToken } from './services/api';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Login from './components/Login';
import { AiOutlineSun } from "react-icons/ai";
import { MdDarkMode } from "react-icons/md";
import './components/Contacts.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' ? true : false;
  });

  useEffect(() => {
    if (user && user.token) {
      setAuthToken(user.token);
      fetchContacts();
    }
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchContacts = async () => {
    const { data } = await getContacts();
    setContacts(data);
  };

  // Improved error handling in form submission
  const handleFormSubmit = async (formData) => {
    try {
      // Log formData entries for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
      }
      if (editingId) {
        await updateContact(editingId, formData);
        toast.success('Contact Updated!');
      } else {
        await createContact(formData);
        toast.success('Contact Added!');
      }
      setForm({ name: '', email: '', phone: '' });
      setEditingId(null);
      fetchContacts();
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to submit contact. Please try again.');
    }
  };

  const handleEdit = (contact) => {
    setForm(contact);
    setEditingId(contact._id);
  };

  const handleDelete = async (id) => {
    await deleteContact(id);
    toast.error('Contact Deleted!');
    fetchContacts();
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      const { data } = await searchContacts(e.target.value);
      setContacts(data);
    } else {
      fetchContacts();
    }
  };

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(user.token);
    toast.success('Logged in successfully!');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setContacts([]);
    setAuthToken(null);
    toast.info('Logged out successfully!');
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={user ? (
            <div className="contacts-container">
              {/* Header */}
              <div className="contacts-header">
                <h1 className="contacts-title">Contacts</h1>
                <div>
                  <button onClick={toggleDarkMode} className="mr-4 logout-button" aria-label="Toggle theme">
                    {darkMode ? <AiOutlineSun /> : <MdDarkMode />}
                  </button>
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                className="search-input"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={handleSearch}
              />

              {/* Contact Form */}
              <ContactForm
                handleSubmit={handleFormSubmit}
                form={form}
                setForm={setForm}
                editingId={editingId}
              />

              {/* Contact List */}
              <ContactList
                contacts={contacts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
