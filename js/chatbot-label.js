"use strict";
const main_elem = document.querySelector("main");
if (!main_elem) {
    throw new Error("No main element!");
}
const file_label = main_elem.querySelector("label");
const file_input = main_elem.querySelector("input[type='file']");
if (!file_label) {
    throw new Error("No file label!");
}
if (!file_input) {
    throw new Error("No file input!");
}
file_input.addEventListener("change", () => {
    if (!file_input.value) {
        file_label.textContent = "Upload image";
    }
    else {
        const file_name = file_input.value
            .split("\\")
            .pop();
        file_label.textContent = file_name;
    }
});
