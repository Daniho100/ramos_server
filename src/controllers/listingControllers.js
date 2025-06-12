import Listing from '../models/listingModel.js';

const createListing = async(req, res, next) => {
  console.log('POST /api/listings/create hit');
  try {
    const { title, description, price, location, images, videos } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      images: images || [],
      videos: videos || [],
      user: userId,
    });

    await listing.populate('user', 'name email');
    res.status(201).json({ message: 'Listing created', listing });
  } catch (error) {
    console.error('Error creating listing:', error.stack);
    next(error);
  }
}

const getAllListings = async(req, res, next) => {
  console.log('GET /api/listings hit');
  try {
    const listings = await Listing.find().limit(10)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

const getListingsByUser = async(req, res, next) => {
  console.log('GET /api/listings/user/:userId hit');
  try {
    const { userId } = req.params;
    const listings = await (await Listing.find({ user: userId })).limit(10).populate('user', 'name email');
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}


const getUserListingById = async(req, res, next) => {
  console.log('GET /api/listings/user/:userId/:listingId hit');
  try {
    const { userId, listingId } = req.params;

    const listing = await Listing.findOne({ _id: listingId, user: userId })
      .populate('user', 'name email');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found for this user' });
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}


const getListingById = async (req, res, next) => {
  console.log('GET /api/listings/:id hit', req.params);
  try {
    const { id } = req.params; 

    const listing = await Listing.findById(id).populate('user', 'name email');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    next(error);
  }
};


const updateListing = async(req, res, next) => {
  console.log('PUT /api/listings/:id hit');
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description, price, location, images, videos } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.user.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not your listing' });
    }

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.location = location || listing.location;
    listing.images = images || listing.images;
    listing.videos = videos || listing.videos;

    await listing.save();
    await listing.populate('user', 'name email');
    res.status(200).json({ message: 'Listing updated', listing });
  } catch (error) {
    next(error);
  }
}

const deleteListing = async(req, res, next) => {
  console.log('DELETE /api/listings/:id hit');
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.user.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not your listing' });
    }

    await listing.deleteOne();
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export {
  createListing,
  getAllListings,
  getListingsByUser,
  getUserListingById,
  getListingById,
  updateListing,
  deleteListing,
};