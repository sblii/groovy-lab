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
    const postPasswordResult = await postJSON('/api/login', postPasswordPayload);

    if (postPasswordResult === true) {
        logInForm.style.display = 'none';
        editForm.style.display = 'block';
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

//Result from HTTP POST File
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    editForm.uploadButton.disabled = true;

    const postFormDataPayload = new FormData();
    postFormDataPayload.append('member', document.getElementById('member-select'));
    postFormDataPayload.append('file', editForm.uploadFile.files[0]);

    const postFormDataResult = await postFile('/api/login', postFormDataPayload);

    if (postFormDataResult === true) {
        document.getElementById('edit-state-message').textContent = 'Upload Complete! Check your mypage.';
        editForm.uploadButton.disabled = false;
    } else {
        document.getElementById('edit-state-message').textContent = 'Upload Fail.';
        editForm.uploadButton.disabled = false;
    }
});
