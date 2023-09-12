// import '@babel/polyfill'; // old version support for some js
import { displayMap } from './mapbox';
import { login, signup, logout } from './login';  
import { updateSettings } from './updateSettings';
import { sendResetLink, resetPassword } from './resetPassword';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const signUpForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const forgotPasswordForm = document.querySelector('.form--identify');
const resetPasswordForm = document.querySelector('.form--resetPassword');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}

if (signUpForm) {
    signUpForm.addEventListener('submit', e => {
        e.preventDefault();
        let name = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        if(lastName)
            name = name + ' ' + lastName;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        // console.log(name, email, password, passwordConfirm);
        signup({name, email, password, passwordConfirm});
    }); 
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    }); 
}

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

if (userDataForm)
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData(); // recreating form programatically
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form);

        updateSettings( form, 'data');
    });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...'

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });

if (forgotPasswordForm)
{
    forgotPasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        // console.log(email);
        sendResetLink(email);
        // document.getElementById('email').value = '';
    })
}

if (resetPasswordForm)
{
    resetPasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const resetToken = urlParams.get('token');
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        // console.log(password, passwordConfirm);
        resetPassword({password, passwordConfirm, resetToken});
    })
}

if (bookBtn)
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset; // dash separated names are by default converted into camel case, and thus we can use destructuring...
        bookTour(tourId);
}); 

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 10);