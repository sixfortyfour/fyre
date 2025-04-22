import { default as Alpine } from 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.7/+esm';

window.Alpine = Alpine;

// setup Alpine
const state = Alpine.reactive({
    view: "form",
    init() {
        let key = window.location.search.substring(1);

        if (key.length > 0) {
            this.view = 'message';
        }
    },
    setView(view) {
        this.view = view;
    },
    showForm() {
        return this.view === "form";
    },
    showUrl() {
        return this.view === "url";
    },
    showMessage() {
        return this.view === "message";
    },
});

Alpine.store('main', state);

Alpine.store("message", {
    key: "",
});  

Alpine.data("encrypt", () => ({
    buttonText: "Get link",
    message: "",
    
    handleSubmit(event) {
        this.buttonText = "Encrypting message, please wait...";

        postRequest(event.target, (response) => {
            response.text().then((data) => {
                setKey(data);
            });

            Alpine.store('main').setView("url");
        });
        },
}));

Alpine.data("link", () => ({
    get messageLink() {
        return window.location.href + `?${Alpine.store('message').key}`;
    },
    trigger: {
        ["@click"]() {
            copyLinkToClipboard();
        }
    },
}));

Alpine.data("decrypt", () => ({
    text: "",
    key: "",
    init() {
        this.key = window.location.search.substring(1);

        if (this.key.length > 0) {
            getRequest(this.key, (response) => {
                if (response.status === 404) {
                    this.text = "Message not found. If you've already seen it, it's gone.";
                    return;
                }

                response.json().then((json) => {
                    this.text = json.message;
                });
            });
        }
    }}));

const setKey = (key) => {
    Alpine.store('message').key = key;
};

function copyLinkToClipboard() {
    const link = document.getElementById("link");
    link.select();
    document.execCommand("copy");
    
    // Copy the text inside the text field
    navigator.clipboard.writeText(link.value);
}

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

// start Alpine
Alpine.start();