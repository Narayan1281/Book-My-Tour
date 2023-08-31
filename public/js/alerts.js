// type is 'success' or 'error'
export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el); // tricky DOM manupulation
};

export const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    // afterbegin ---> insert in the starting of body element
    window.setTimeout(hideAlert, 3000); // hide after 3s
};