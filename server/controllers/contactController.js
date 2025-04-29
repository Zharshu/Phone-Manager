const Contact = require('../models/contactModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../uploads')); // Use absolute path for uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Middleware to handle file upload
const uploadSingle = upload.single('photo');

const uploadFields = upload.fields([{ name: 'photo', maxCount: 1 }]);

const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    console.log('Received createContact data:', { name, email, phone });

      // Validate required fields
      if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required' });
      }

    let photoUrl = '';

    console.log('req.files:', req.files);
    if (req.files && req.files.photo && req.files.photo.length > 0) {
      const file = req.files.photo[0];
      console.log('file.path:', file.path);
      // Save local file path as photoUrl (relative to uploads folder)
      photoUrl = `/uploads/${path.basename(file.path)}`;
    } else {
      // Generate photo URL from ui-avatars.com
      const formattedName = encodeURIComponent(name.trim());
      photoUrl = `https://ui-avatars.com/api/?name=${formattedName}`;
    }

    const contact = new Contact({ userId: req.user.id, name, email, phone, photoUrl });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    console.error('Create Contact Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id })
      .collation({ locale: 'en', strength: 2 })
      .sort({ name: 1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const multerMiddleware = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    uploadFields(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: `Error uploading file: ${err.message}` });
      }
      next();
    });
  } else {
    next();
  }
};

const updateContact = async (req, res) => {
  console.log('UpdateContact req.body:', req.body);
  console.log('UpdateContact req.file:', req.file);
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    let photoUrl = '';

    if (req.files && req.files.photo && req.files.photo.length > 0) {
      photoUrl = `/uploads/${path.basename(req.files.photo[0].path)}`;
    }

    // Find existing contact
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if the contact belongs to the authenticated user
    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this contact' });
    }

    // Update contact fields only if provided and different from existing
    if (typeof name !== 'undefined' && name !== contact.name) {
      contact.name = name;
    }
    if (typeof email !== 'undefined' && email !== contact.email) {
      contact.email = email;
    }
    if (typeof phone !== 'undefined' && phone !== contact.phone) {
      contact.phone = phone;
    }
    if (photoUrl) {
      contact.photoUrl = photoUrl;
    } else if (!contact.photoUrl) {
      // Assign default photo URL if none exists
      const formattedName = encodeURIComponent(contact.name.trim());
      contact.photoUrl = `https://ui-avatars.com/api/?name=${formattedName}`;
    }

    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this contact' });
    }
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Contact Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const searchContacts = async (req, res) => {
  try {
    const { query } = req.params;
    const contacts = await Contact.find({ name: { $regex: query, $options: 'i' } });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createContact, getContacts, getContactById, updateContact, deleteContact, searchContacts, uploadSingle, uploadFields };
