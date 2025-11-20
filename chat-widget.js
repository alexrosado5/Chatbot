/** --- Load Geist Font --- */
const font = document.createElement("link");
font.rel = "stylesheet";
font.href = "https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css";
document.head.appendChild(font);

/** --- Inject CSS --- */
const css = `
.n8n-chat-widget {
    --primary: var(--chat-primary, #ffa22b);
    --secondary: var(--chat-secondary, #e17a00);
    --bg: var(--chat-bg, #ffffff);
    --text: var(--chat-text, #333333);
    font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Toggle button */
.chat-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    font-size: 28px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    transition: 0.25s ease;
}
.chat-toggle:hover {
    transform: scale(1.08);
}

/* Chat window */
.chat-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 600px;
    background: var(--bg);
    border-radius: 18px;
    box-shadow: 0 16px 32px rgba(0,0,0,0.18);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px);
    transition: 0.32s ease;
}
.chat-container.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
}

/* Header */
.chat-header {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #eee;
}
.chat-header img {
    width: 34px;
    height: 34px;
    border-radius: 8px;
}
.chat-header span {
    font-size: 17px;
    font-weight: 600;
}
.chat-close {
    margin-left: auto;
    cursor: pointer;
    font-size: 22px;
    opacity: 0.6;
}
.chat-close:hover {
    opacity: 1;
}

/* Chat body */
.chat-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Message bubbles */
.msg {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 14px;
    font-size: 15px;
    line-height: 1.45;
    animation: fadeIn 0.25s ease;
}

/* USER MESSAGE — orange with black text */
.msg.user {
    align-self: flex-end;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: black;
    font-weight: 500;
    border-bottom-right-radius: 4px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.12);
}

/* BOT MESSAGE — white clean bubble */
.msg.bot {
    align-self: flex-start;
    background: white;
    color: var(--text);
    border: 1px solid rgba(0,0,0,0.1);
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

/* Input */
.chat-input {
    padding: 14px;
    display: flex;
    gap: 10px;
    border-top: 1px solid #eee;
}
.chat-input textarea {
    flex: 1;
    padding: 12px;
    font-size: 14px;
    border-radius: 10px;
    border: 1px solid #ddd;
    resize: none;
}
.chat-input button {
    padding: 10px 22px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    font-weight: 600;
}

/* Animation */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

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
