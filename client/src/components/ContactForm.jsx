// ContactForm.jsx
import React, { useState } from 'react';
import './Contacts.css';

function ContactForm({ handleSubmit, form, setForm, editingId }) {
  const [photoFile, setPhotoFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Prepare FormData
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    handleSubmit(formData);
  };

  return (
    <form className="contact-form-container" onSubmit={onSubmit}>
      <h2 className="form-title">{editingId ? 'Edit Contact' : 'Add New Contact'}</h2>

      <div className="form-group">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="form-input"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="form-input"
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="form-input"
          placeholder="+1 (555) 123-4567"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="photo" className="form-label">Photo (optional)</label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handlePhotoChange}
          className="form-input"
        />
      </div>

      <button type="submit" className="add-contact-button">
        <span className="plus-icon">+</span> {editingId ? 'Update Contact' : 'Add Contact'}
      </button>
    </form>
  );
}

export default ContactForm;
