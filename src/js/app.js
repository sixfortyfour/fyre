
document.addEventListener("alpine:init", () => {
    Alpine.store('view', {
        current: 'form',
    });

    Alpine.store("message", {
        key: "",
    });

    let key = window.location.search.substring(1);

    if (key.length > 0) {
        Alpine.store('view').current = 'message';
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
});

const getKey = () => {
    return Alpine.store('message').key;
};

const setKey = (key) => {
    Alpine.store('message').key = key;
};

const setView = (view) => {
    Alpine.store('view').current = view;
};

const getView = () => {
    return Alpine.store('view').current;
};