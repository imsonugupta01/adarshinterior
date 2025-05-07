const Service = require('../Models/service');

// Utility to safely parse JSON fields (if needed in future)
const parseField = (field) => {
  try {
    return field ? JSON.parse(field) : null;
  } catch {
    return null;
  }
};

// ✅ Create a new service
exports.createService = async (req, res) => {
  try {
    const { heading } = req.body;

    if (!heading) {
      return res.status(400).json({ message: 'Heading is required' });
    }

    // Extract the first file URL from pictures and videos fields (assuming only 1 file each)
    const pictures = req.files?.pictures?.[0]?.path || '';  // Single picture
    const videos = req.files?.videos?.[0]?.path || '';  // Single video

    const newService = new Service({
      heading,
      pictures,
      videos,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error });
  }
};

// ✅ Update a service (heading, isActive, media)
exports.updateService = async (req, res) => {
  const { id } = req.params;

  try {
    const updateData = {};

    if (req.body.heading) updateData.heading = req.body.heading;
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;

    // If new pictures or videos are uploaded, only update the respective fields
    if (req.files?.pictures) {
      updateData.pictures = req.files.pictures[0]?.path || '';
    }

    if (req.files?.videos) {
      updateData.videos = req.files.videos[0]?.path || '';
    }

    const updatedService = await Service.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
  }
};

// ✅ Update isActive status only
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(id, { isActive }, { new: true });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
};

// ✅ Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
};

// ✅ Get a service by ID
exports.getServiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error });
  }
};

// ✅ Delete a service
exports.deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
};
