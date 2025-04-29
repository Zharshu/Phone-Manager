import React from 'react';
import './Contacts.css';

function ContactList({ contacts, handleEdit, handleDelete }) {
  if (!contacts || contacts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="empty-title">No contacts found</h2>
        <p className="empty-description">Add new contacts to see them here</p>
      </div>
    );
  }
  
  return (
    <ul className="contacts-list">
      {contacts.map((contact) => (
        <li key={contact._id || contact.id} className="contact-item contact-item-responsive">
          <div className="contact-photo-container">
            <img
             src={contact.photoUrl.startsWith('/uploads') ? `https://phone-manager-18mp.onrender.com${contact.photoUrl}` : contact.photoUrl}

              alt={`${contact.name}'s avatar`}
              className="contact-photo"
            />
          </div>
          <div className="contact-info-container">
            <p className="contact-name">{contact.name}</p>
            <p className="contact-email">{contact.email}</p>
            <p className="contact-phone">{contact.phone}</p>
          </div>
          <div className="contact-actions-container">
            <button onClick={() => handleEdit(contact)} className="logout-button" style={{ marginRight: '0.5rem' }}>
              Edit
            </button>
            <button onClick={() => handleDelete(contact._id || contact.id)} className="logout-button">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ContactList;