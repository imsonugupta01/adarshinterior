const MyWork = require('../Models/MyWorks');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');



exports.createMyWork = async (req, res) => {
    try {
      const { heading, description, location } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const mimeType = req.file.mimetype;
  
      let resourceType = 'auto';
      let folder = 'mywork_misc';
      let mediaUrl = '';
  
      if (mimeType.startsWith('image/')) {
        resourceType = 'image';
        folder = 'mywork_photos';
      } else if (mimeType.startsWith('video/')) {
        resourceType = 'video';
        folder = 'mywork_videos';
      }
  
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: resourceType,
        folder,
      });
  
      fs.unlinkSync(req.file.path); // delete temp file
  
      mediaUrl = result.secure_url;
  
      const newWork = await MyWork.create({
        heading,
        description,
        location,
        photo: resourceType === 'image' ? mediaUrl : null,
        video: resourceType === 'video' ? mediaUrl : null,
      });
  
      res.status(201).json(newWork);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

// Other functions remain the same


exports.getAllMyWork = async (req, res) => {
  try {
    const works = await MyWork.aggregate([
      {
        $group: {
          _id: "$heading",
          description: { $first: "$description" },
          location: { $first: "$location" },
          isActive: { $first: "$isActive" },
          works: {
            $push: {
              _id: "$_id",
              photo: "$photo",
              video: "$video"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          heading: "$_id",
          description: 1,
          location: 1,
          isActive: 1,
          works: 1
        }
      },
      {
        $sort: { heading: 1 }
      }
    ]);

    res.status(200).json(works);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getMyWorkById = async (req, res) => {
  try {
    const work = await MyWork.findById(req.params.id);
    if (!work) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(work);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMyWork = async (req, res) => {
  try {
    const updated = await MyWork.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMyWork = async (req, res) => {
  try {
    await MyWork.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
