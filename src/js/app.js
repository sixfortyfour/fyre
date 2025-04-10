document.addEventListener("alpine:init", () => {
    const state = Alpine.reactive({
        view: "form",
        setView(view) {
            console.log('setView', view);
            this.view = view;
        },
        showForm() {
            console.log('showForm', this.view === "form");
            return this.view === "form";
        },
        showUrl() {
            console.log('showUrl', this.view === "url");
            return this.view === "url";
        },
        showMessage() {
            console.log('showMessage', this.view === "message");
            return this.view === "message";
        },
    });

    Alpine.store('main', state);

    Alpine.store("message", {
        key: "",
    });

    let key = window.location.search.substring(1);

    if (key.length > 0) {
        Alpine.store('main').view = 'message';
    }

    Alpine.data("link", () => ({
        get messageLink() {
            console.log(`messageLink called: ${Alpine.store('message').key}`);
            return window.location.href + `?${Alpine.store('message').key}`;
        },
        trigger: {
            ["@click"]() {
                copyLinkToClipboard();
            }
        },
    }));

    Alpine.data("form", () => ({
        buttonText: "Get link",
        message: "",
        
        handleSubmit(event) {
            console.log('Submitting form');
            makeRequest(event.target, (response) => {
                response.text().then((data) => {
                    setKey(data);
                });

                Alpine.store('main').setView("url");
                console.log('Submitted form');
            });
          },
    }));

    Alpine.data("message", () => ({
        text: "",
        init() {
            if (key.length > 0) {
                this.getMessageByKey(key);
            }
        },
        
        getMessageByKey() {
            console.log('getMessageByKey');

            fetch(`/api/decrypt/${key}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }}).then((response) => {
                    response.json().then((json) => {
                        console.log('JSON:', json.message);
                        this.text = json.message;
                    });
                })
                .catch(() => {
                    console.error = "An error occurred. Please try again.";
                });

    }}));
});

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

function makeRequest(form, onComplete) {
    const formData = new FormData(form);
    const json = Object.fromEntries(formData.entries());
    fetch(`/api/encrypt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(json),
    }).then(onComplete);
  }