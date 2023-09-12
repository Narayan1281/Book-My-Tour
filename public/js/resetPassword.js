import { showAlert } from './alerts';

export const sendResetLink = async (email) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'api/v1/users/forgotPassword',
            data: { email }
        });

        if(res.data.status === 'success') {
            showAlert('success', res.data.message, 15);
        }
    } catch (err) {
        showAlert('error', err.response.data.message, 15);
    }
};