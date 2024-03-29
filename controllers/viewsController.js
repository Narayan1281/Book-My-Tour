const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
    const { alert } = req.query;

    if(alert === 'booking')
        res.locals.alert = "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";

    next();
};

exports.getOverview = catchAsync(async (req, res, next) =>{
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template

    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) =>{
    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    
    // 2) Build template
    // 3) Render template using data from 1)

    // https://stackoverflow.com/questions/66650925/getting-error-message-while-try-to-load-mapbox
    // the above link helps resolve Content Security policy directive that prevents the browsers from loading content(images, scripts, videos, etc) from unsupported sources (here it happend because of helmet package)

    if(!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }
    
    // The following set method was overwriting app.js CSP policy
    // hence, removing it works fine
    // .set('Content-Security-Policy', "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;")

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.getSignUpForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Join Find-My-Tour'
    });
};

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
};

exports.forgotPassword = (req, res) => {
    res.status(200).render('forgotPassword', {
        title: 'Account ecovery'
    });
};

exports.resetPassword = (req, res) => {
    res.status(200).render('resetPassword', {
        title: 'Reset your password'
    })
}

exports.getMyTours = catchAsync(async (req, res, next) => {
    // can also be implemented using virtual populate method
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });
    // $in operator searches for all the id available in tourIDs

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    });
});

// one simple doubt will it return an error if 
// only name or email is provided?
exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true, // return updated data
            runValidators: true
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});