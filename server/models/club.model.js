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
      // contactEmail: {
      //   type: String,
      //   required: true,
      //   match: [/.+\@.+\..+/, 'Please fill a valid email address'],
      // },
      // socialLinks: {
      //   instagram: {
      //     type: String,
      //     match: /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/, // URL validation for Instagram
      //   },
      //   website: {
      //     type: String,
      //     match: /^https?:\/\/[a-zA-Z0-9-._~:\/?#@!$&'()*+,;=%]+$/, // URL validation for website
      //   }
      // }
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


