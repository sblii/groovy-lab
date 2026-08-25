//HTTP POST JSON
async function postJSON(link, data) {
    try {
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Log) Complete to connect [%s]', result);
            return true;
        } else {
            console.log('Log) Fail to connect [%s]', result);
            return false;
        }
    } catch (error) {
        console.error('Log) ERROR:', error);
        return false;
    }
}

//Result from HTTP POST JSON
const logInForm = document.getElementById('log-in-form');
const editForm = document.getElementById('edit-form');

logInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const passwordInput = logInForm.password.value;
    const postPasswordPayload = { password: passwordInput };
    const postPasswordResult = await postJSON('/api/verify', postPasswordPayload);

    if (postPasswordResult === true) {
        document.getElementById('log-in-section').style.display = 'none';
        document.getElementById('edit-section').style.display = 'block';
    } else {
        document.getElementById('password-state-message').textContent = 'The password is incorrect. Try again.';
    }
});

//HTTP POST FILE
async function postFile(link, data) {
    try {
        const response = await fetch(link, {
            method: 'PUT',
            credentials: 'include',
            body: data,
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Log) Complete to connect [%s]', result);
            return { success: true, text: result.message };
        } else {
            console.log('Log) Fail to connect [%s]', result);
            return { success: false, text: result.error || 'An unknown error has occurred' };
        }
    } catch (error) {
        console.error('Log) ERROR:', error);
        return { success: false, text: 'The connection has expired' };
    }
}

//Result from HTTP POST File
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    editForm.uploadButton.disabled = true;

    const messageDiv = document.getElementById('edit-state-message');
    messageDiv.textContent = 'Uploading...';

    const postFormDataPayload = new FormData();
    postFormDataPayload.append('member', document.getElementById('member-select').value);
    postFormDataPayload.append('file', editForm.uploadFile.files[0]);

    const postFormDataResult = await postFile('/api/upload', postFormDataPayload);

    messageDiv.textContent = postFormDataResult.text;

    if (postFormDataResult.success === true) {
        document.getElementById('edit-state-message').textContent = 'Upload Complete! Check your mypage.';
        editForm.uploadButton.disabled = true;
    } else {
        editForm.uploadButton.disabled = false;
    }
});
