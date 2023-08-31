// import axios from "axios"; // importing from npm package simply won't work
                            // however using CDN link works fine!
import { showAlert } from './alerts';

// export modules in javaScript with ES6
// node.js uses common js for export import functionality

export const login = async (email, password) => {
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login', // since website and api are hosted on same server, hence relative path works
            data: {
                email,
                password
            },
            withCredentials: true
        });

        if(res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500); // refresh after 1500 ms
        }
        // console.log(res);
    } catch(err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        // it's an ajax request so the reload has to be done 
        // from client side
        // if(res.data.status = 'success') location.reload(true); // reload from server (not cache!)
        if(res.data.status === 'success') {
            showAlert('success', 'Logged out successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500); // refresh after 1500 ms
        }
    } catch (err){
        showAlert('error', 'Error logging out! Try again.');
    }
};