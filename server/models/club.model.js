import mongoose from 'mongoose'

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: 'Club name already exists',
    required: 'Club name is required'
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    trim: true,
    required: 'Status is required'
  },
  type: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'arts', 'technology', 'volunteering', 'business', 'social', 'health', 'environmental'],
    trim: true,
    required: 'Type is required'
  },
  leadership: [
    {
      leadershipId: {
        type: String,
        trim: true,
        required: 'Leadership id is required'
      }
    }
  ],
  pictureUri: {
    type: String,
    trim: true,
    required: 'PictureUri is required'
  },
  contactInfo: [
    {
      name: {
        type: String,
      },
      status: {
        type: Boolean,
      },
      uri: {
        type: String,
      },
    }
  ],
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Club', ClubSchema);


