// Grab elements
const selectElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) return element;
    throw new Error(`Something went wrong! Make sure that ${selector} exists/is typed correctly.`);
};

// Handle file upload
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
};

// Publish blog post
const publishBtn = selectElement('.publish-btn');
const titleField = selectElement('.title');
const articleField = selectElement('.article');

publishBtn.addEventListener('click', async () => {
    const title = titleField.value;
    const article = articleField.value;
    const bannerUpload = selectElement('#banner-upload');
    let bannerUrl = '';

    if (bannerUpload.files.length > 0) {
        bannerUrl = await handleFileUpload({ target: bannerUpload });
    }

    if (title && article) {
        db.collection('blogs').add({
            title: title,
            article: article,
            bannerUrl: bannerUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Blog published!');
            titleField.value = '';
            articleField.value = '';
        }).catch(error => {
            console.error('Error adding document: ', error);
        });
    } else {
        alert('Title and article are required!');
    }
});

document.getElementById('banner-upload').addEventListener('change', handleFileUpload);
document.getElementById('image-upload').addEventListener('change', handleFileUpload);
