const MyWork = require('../Models/MyWorks');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');





exports.createMyWork = async (req, res) => {
  try {
    const { heading, description, location, type } = req.body;

    // Normalize tags
    let tags = [];
    if (Array.isArray(req.body.tags)) {
      tags = req.body.tags;
    } else if (typeof req.body.tags === 'string') {
      tags = [req.body.tags]; // single tag case
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const mimeType = file.mimetype;
      let resourceType = 'auto';
      let folder = 'mywork_misc';

      if (mimeType.startsWith('image/')) {
        resourceType = 'image';
        folder = 'mywork_photos';
      } else if (mimeType.startsWith('video/')) {
        resourceType = 'video';
        folder = 'mywork_videos';
      }

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        folder,
      });

      fs.unlinkSync(file.path); // delete temp file
      uploadedFiles.push(result.secure_url);
    }

    const newWork = await MyWork.create({
      heading,
      description,
      location,
      type,
      files: uploadedFiles,
      tags, // properly parsed
    });

    res.status(201).json(newWork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// controllers/myWorkController.js

exports.getMyWorkByType = async (req, res) => {
  try {
    const { type } = req.params;

    const works = await MyWork.find({ type });

    if (!works.length) {
      return res.status(404).json({ message: `No work entries found for type '${type}'` });
    }

    res.status(200).json(works);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch work entries by type' });
  }
};

// controllers/myWorkController.js

exports.getAllMyWork = async (req, res) => {
  try {
    const works = await MyWork.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(works);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch work entries' });
  }
};


exports.getMyWorkById = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await MyWork.findById(id);

    if (!work) {
      return res.status(404).json({ message: 'Work entry not found' });
    }

    res.status(200).json(work);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the work entry' });
  }
};


// controllers/myWorkController.js

exports.deleteMyWork = async (req, res) => {
  try {
    const { id } = req.params;

    const work = await MyWork.findByIdAndDelete(id);

    if (!work) {
      return res.status(404).json({ message: 'Work entry not found' });
    }

    res.status(200).json({ message: 'Work entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete work entry' });
  }
};


exports.findTypes = async (req, res) => {
  try {
    const types = await MyWork.distinct('type');

    if (!types || types.length === 0) {
      return res.status(404).json({ message: 'No types found' });
    }

    res.status(200).json({ types });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch unique types' });
  }
};


// controllers/myWorkController.js

exports.getFilesByType = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    // Find all MyWork entries matching the type
    const works = await MyWork.find({ type });

    if (!works || works.length === 0) {
      return res.status(404).json({ message: 'No work entries found for this type' });
    }

    // Extract all files from matching documents
    const allFiles = works.flatMap(work => work.files);

    res.status(200).json({ files: allFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};
