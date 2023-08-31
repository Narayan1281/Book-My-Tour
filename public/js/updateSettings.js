import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
    try {
        const urlEndPoint = type === 'password' ? 'updateMyPassword' : 'updateMe';
        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:8000/api/v1/users/${urlEndPoint}`,
            data 
        });

        if(res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
            window.setTimeout(function(){
                window.location.reload(true); // you can pass true to reload function to ignore the client cache and reload from the server
            },1400); 
            // location.reload(true);  // we'll do it in later stage
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};