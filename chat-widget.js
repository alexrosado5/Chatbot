/** --- Load Geist Font --- */
const font = document.createElement("link");
font.rel = "stylesheet";
font.href = "https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css";
document.head.appendChild(font);

/** --- Inject CSS --- */
const css = `YOUR CSS HERE (paste your full CSS block)`;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

/** --- MAIN CHAT WIDGET LOGIC --- */
(function () {

    if (!window.ChatWidgetConfig) {
        console.error("ChatWidgetConfig not found.");
        return;
    }

    const cfg = window.ChatWidgetConfig;

    // root wrapper
    const root = document.createElement("div");
    root.className = "n8n-chat-widget";

    /** --- TOGGLE BUTTON --- */
    const toggle = document.createElement("button");
    toggle.className = "chat-toggle";
    toggle.textContent = "💬";

    /** --- CHAT CONTAINER --- */
    const chat = document.createElement("div");
    chat.className = "chat-container";

    /** --- HEADER --- */
    const header = document.createElement("div");
    header.className = "chat-header";
    header.innerHTML = `
        <img src="${cfg.branding.logo}" alt="${cfg.branding.name}">
        <span>${cfg.branding.name}</span>
        <div class="chat-close">×</div>
    `;

    /** --- BODY --- */
    const body = document.createElement("div");
    body.className = "chat-body";

    /** --- INPUT AREA --- */
    const input = document.createElement("div");
    input.className = "chat-input";
    input.innerHTML = `
        <textarea placeholder="Escribe tu mensaje..."></textarea>
        <button>Enviar</button>
    `;

    chat.appendChild(header);
    chat.appendChild(body);
    chat.appendChild(input);

    root.appendChild(chat);
    root.appendChild(toggle);
    document.body.appendChild(root);

    /** --- TOGGLE CHAT --- */
    toggle.addEventListener("click", () => {
        chat.classList.toggle("open");
    });

    header.querySelector(".chat-close").addEventListener("click", () => {
        chat.classList.remove("open");
    });

    /** --- SESSION ID --- */
    let sessionId = crypto.randomUUID();

    /** --- SEND MESSAGE FUNCTION --- */
    async function sendMessage(text) {

        // Add user bubble
        addMessage("user", text);

        const payload = [{
            action: "sendMessage",
            sessionId: sessionId,
            route: cfg.webhook.route,
            chatInput: text,
            metadata: { userId: "" }
        }];

        try {
            const res = await fetch(cfg.webhook.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            const botReply = Array.isArray(data) ? data[0].output : data.output;

            addMessage("bot", botReply);

        } catch (err) {
            addMessage("bot", "⚠️ Error al conectar con el servidor.");
        }
    }

    /** --- ADD MESSAGE TO CHAT --- */
    function addMessage(type, text) {
        const msg = document.createElement("div");
        msg.className = "msg " + type;
        msg.textContent = text;
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
    }

    /** --- INPUT EVENTS --- */
    const textarea = input.querySelector("textarea");
    const sendBtn = input.querySelector("button");

    textarea.addEventListener("keypress", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const value = textarea.value.trim();
            if (value.length > 0) {
                sendMessage(value);
                textarea.value = "";
            }
        }
    });

    sendBtn.addEventListener("click", () => {
        const value = textarea.value.trim();
        if (value.length > 0) {
            sendMessage(value);
            textarea.value = "";
        }
    });

})();
