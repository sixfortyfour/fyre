const httpHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

function postRequest(form, onComplete) {
    const formData = new FormData(form);
    const json = Object.fromEntries(formData.entries());
    fetch(`/api/encrypt`, {
        method: "POST",
        headers: httpHeaders,
        body: JSON.stringify(json),
    }).then(onComplete);
  }

function getRequest(key, onComplete){
    fetch(`/api/decrypt/${key}`, {
        method: "GET",
        headers: httpHeaders,
    }).then(onComplete);
}

function copyLinkToClipboard() {
    const link = document.getElementById("link");
    link.select();
    document.execCommand("copy");
    
    // Copy the text inside the text field
    navigator.clipboard.writeText(link.value);
}

export { postRequest, getRequest, copyLinkToClipboard };