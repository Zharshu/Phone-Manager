import React from 'react';
import './Contacts.css';

function ContactItem({ contact, handleEdit, handleDelete }) {
  return (
    <div className="contact-item">
      <div>
        <h2 className="contact-name">{contact.name}</h2>
        <p className="contact-email">{contact.email} | {contact.phone}</p>
      </div>
      <div>
        <button onClick={() => handleEdit(contact)} className="logout-button" style={{ marginRight: '0.5rem' }}>
          Edit
        </button>
        <button onClick={() => handleDelete(contact._id || contact.id)} className="logout-button">
          Delete
        </button>
      </div>
    </div>
  );
}

export default ContactItem;