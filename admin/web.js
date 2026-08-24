//Array for member options
const members = [
    { id: 'hyobin', name: 'Kim Hyobin' },
    { id: 'yeyoung', name: 'Kwon Yeyoung' },
    { id: 'soyul', name: 'Park Soyul' },
    { id: 'sebin', name: 'Eom Sebin' },
    { id: 'hyunbin', name: 'Lee Hyunbin' },
];
const memberSelect = document.getElementById('member-select');
const memberSelectFragment = document.createDocumentFragment();

members.forEach((member) => {
    const optionElement = document.createElement('option');
    optionElement.value = member.id;
    optionElement.textContent = member.name;
    memberSelectFragment.appendChild(optionElement);
});

memberSelect.appendChild(memberSelectFragment);

//Secure file upload
const editForm = document.getElementById('edit-form');

editForm.addEventListener('change', () => {
    const selectedMember = memberSelect.value;
    if (editForm.uploadFile.files && editForm.uploadFile.files.length > 0) {
        document.getElementById('upload-file-button-text').textContent = editForm.uploadFile.files[0].name.normalize('NFC');
        if (members.some((member) => member.id === selectedMember)) {
            editForm.uploadButton.disabled = false;
        }
    } else {
        editForm.uploadButton.disabled = true;
    }
});

//Secure Password submit
const logInForm = document.getElementById('log-in-form');

logInForm.addEventListener('input', () => {
    const passwordInput = logInForm.password.value;

    if (passwordInput.length > 0) {
        logInForm.passwordSubmitButton.disabled = false;
    } else {
        logInForm.passwordSubmitButton.disabled = true;
    }
});
