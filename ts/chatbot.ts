document.addEventListener('DOMContentLoaded', async() => {
    const main: HTMLElement | null = document.body.querySelector('main');

    if (!main) {
        throw new Error("No main element!");
    }

    const send_btn: HTMLButtonElement | null = main.querySelector('#send-btn');

    const send = async (): Promise<void> => {
        const model_choices: HTMLSelectElement | null = main.querySelector('select#model-choices');
        const msg: HTMLInputElement | null = main.querySelector('#msg');
        const image_inp: HTMLInputElement | null = main.querySelector('#image');
        const wait_msg: HTMLParagraphElement | null = main.querySelector('#wait-msg');
        const response_result: HTMLDivElement | null = main.querySelector('#response-result');

        const check_invalid_elements = async(): Promise<void | never> => {
            if (!model_choices || !msg || !send_btn || !wait_msg || !response_result) {
                throw new Error("Required elements missing!");
            }
        }

        await check_invalid_elements();

        const alert_msg: string = "Error! Try again later!"

        const fd: FormData = new FormData();
        fd.append('model-choices', model_choices.value)
        fd.append('msg', msg.value);

        if (image_inp.files.length > 0) {
            fd.append('image', image_inp.files[0]);
        }

        wait_msg.textContent = "Responding... (this might take a few minutes)";
        send_btn.disabled = true;

        try {
            const response: Response = await fetch('https://chatbot.placewith5s.com/chat', {
                method: 'POST',
                body: fd
            });

            if (!response.ok) {
                alert(alert_msg)
                throw new Error("Invalid response received!");
            }

            const body_text: string = await response.text();

            if (!body_text) {
                alert(alert_msg)
                throw new Error("No body text!");
            }

            const raw_html = marked.parse(body_text, { breaks: true });
            const safe_html = DOMPurify.sanitize(raw_html);

            const result: HTMLDivElement = document.createElement('div');
            result.classList.add('chat-response');
            result.innerHTML = safe_html;
            response_result.appendChild(result);

            // clear previous message on success
            msg.value = "";
        } catch (err) {
            alert(alert_msg)
            throw new Error(`Chatbot can't respond! ${err}`);
        } finally {
            wait_msg.textContent = "";
            send_btn.disabled = false;
        }
    };

    send_btn?.addEventListener('click', async() => {
        await send();
    }, {passive: true});
});