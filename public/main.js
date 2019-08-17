document.getElementById('newChirp').addEventListener('click', () => {
    const messageForm = document.getElementById('createMessage');
    messageForm.style.display = messageForm.style.display == 'none' ? 'block' : 'none';
})
document.querySelector('#sendChirp').addEventListener('click', () => {
    const messageForm = document.getElementById('createMessage');
    messageForm.style.display = messageForm.style.display == 'none' ? 'block' : 'none';
})
const uploadModal = document.querySelector('#uploadModalContainer')
document.querySelector('#profilePicture').addEventListener('click', () => {
    uploadModal.style.display = uploadModal.style.display === "none" ? 'block' : 'none'
})
const deleteModal = document.querySelector('#deleteModalContainer')
document.querySelector('#deleteAccount').addEventListener('click', (e) => {
    e.preventDefault()
    deleteModal.style.display = deleteModal.style.display === "none" ? 'block' : 'none'
})
window.onclick = function (event) {
    if (event.target === deleteModal) {
        deleteModal.style.display = "none";
    } else if (event.target === uploadModal) {
        uploadModal.style.display = "none";
    }
}