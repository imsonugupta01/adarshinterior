const Contact = require("../Models/Contact");

exports.addContact= async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || phoneNumber.length !== 10) {
      return res.status(400).json({ message: 'Phone number must be 10 digits!' });
    }

    const newContact = new Contact({
      phoneNumber,
      isContacted: false, // default
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact added successfully!', contact: newContact });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'Phone number already exists!' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// routes/contact.js
exports.updateStatus= async (req, res) => {
  try {
    const { id } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { isContacted: true },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found!' });
    }

    res.status(200).json({ message: 'Contact updated successfully!', contact: updatedContact });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// routes/contact.js
exports.findAllContacts=async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
