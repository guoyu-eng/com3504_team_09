function deleteBird(id, imgPath) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/function/birddelete?id=${id}&imgPath=${imgPath}`);
    xhr.onload = function() {
        if (xhr.status === 200) {
            window.location.href = '/';
        } else {
            console.log(xhr.statusText);
        }
    };
    xhr.send();
}
