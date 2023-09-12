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

export const resetPassword = async (data) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `api/v1/users/resetPassword/${data?.resetToken}`,
            data
        });

        if(res.data.status === 'success') {
            showAlert('success', "Password reset successful! Login to book tours.", 10);
        }

    } catch (err) {
        showAlert('error', err.response.data.message, 5);
    }
}