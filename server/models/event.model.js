
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Event title is required.'],
            trim: true, // Removes leading and trailing spaces
            maxlength: [100, 'Title cannot exceed 100 characters.']
        },
        date: {
            type: Date,
            required: [true, 'Event date is required.'],
            validate: {
                validator: (value) => value >= new Date(),
                message: 'Event date cannot be in the past.'
            }
        },
        location: {
            type: String,
            required: [true, 'Event location is required.'],
            trim: true
        },
        description: {
            type: String,
            required: false,
            maxlength: [500, 'Description cannot exceed 500 characters.'],
            trim: true
        },
        organizer: {
            type: String,
            required: [true, 'Organizer name is required.'],
            trim: true
        },
        actions: {
            type: String,
            required: false, // Optional field
            trim: true
        },
     
        created: {
            type: Date,
            default: Date.now
        },
        updated: {
            type: Date
        }

    },
    {
        timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
    }
);

// Add custom error messages and constraints
eventSchema.post('save', function (error, doc, next) {
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        next(new Error(errors.join(', ')));
    } else {
        next(error);
    }
});

// Pre-save middleware to update the `updated` field
eventSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.updated = Date.now();
    }
    next();
});

const RatingSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
});


const Event = mongoose.model('Event','Rating', eventSchema,RatingSchema);

export default Event;
