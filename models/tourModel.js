const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        trim: true,
        unique: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters'],
        minlength: [10, 'A tour name must have more or equal than 10 characters']
        // validate: [validator.isAlpha, 'Tour name must only contain characters'] // third party validators    
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10)/10 // 4.666, 46.66 , 47, 4.7 
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required:  [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                // this only points to current doc on NEW document creation
                return val < this.price;
            }, // custom validator
            message: 'Discount price ({VALUE}) should be below regular price'
        }
        
    },
    summary: {
        type: String,
        trim: true,
        required:  [true, 'A tour must have a description']
    },
    description: {
        type:String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false // This will not be showed to user during query
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default:false
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // guides: Array
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// tourSchema.index({price: 1}); // ascending order (single field index)
tourSchema.index({ price: 1, ratingsAverage: -1 }); 
tourSchema.index({ slug: 1 }); 
tourSchema.index({ startLocation: '2dsphere' });

// L#104: virtual Properties
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
}); // we cannot afford to have an array in our mongoDB model which grows indefinitely
// so we used parent referencing and this creates a problem
// to resolve that we use virtual populate the review field

// DOCUMENT MIDDLEWWARE: runs before .save() and .create()
// but .insertMany() do not trigger this middleware
tourSchema.pre('save', function(next) {
    // console.log(this)
    this.slug = slugify(this.name, {lower: true });
    next();
}); // or pre save hook

// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     // returns a list of promises --> so we need to await
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

// Query MIDDLEWARE
tourSchema.pre(/^find/, function(next) {   
    // this-> will point to query not document
    // It is used for some secret features which are meant for some VVIP
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
}); // pre find hook

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt -passwordResetToken -passwordResetExpires'
    });

    next();
});

// tourSchema.post(/^find/, function(docs, next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//     next();
// });

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
    // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    // console.log(this.pipeline());
    // next();
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;