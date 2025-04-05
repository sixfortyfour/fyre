function global() {
    return {
        showForm: true,
        showUrl: false,
        showMessage: false
    }
}

document.addEventListener("alpine:init", () => {
    // set global to be reactive
    global = Alpine.reactive(global());

    console.log('State:', global.showForm, global.showUrl, global.showMessage);

    let key = window.location.search.substring(1);

    if (key.length > 0) {
        global.showMessage = true;
        global.showForm = false;
        global.showUrl = false;
    }

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

    Alpine.store("message", {
        key: "",
    });
});

const getKey = () => {
    return Alpine.store('message').key;
};

const setKey = (key) => {
    Alpine.store('message').key = key;
};