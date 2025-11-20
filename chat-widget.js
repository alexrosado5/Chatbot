document.addEventListener("DOMContentLoaded", function () {

    /************************************
     * 1. LOAD AND INJECT FONTS + STYLE *
     ************************************/
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css";
    document.head.appendChild(font);

    const css = `
        .n8n-chat-widget {
            --primary: var(--chat-primary, #854fff);
            --secondary: var(--chat-secondary, #6b3fd4);
            --bg: var(--chat-bg, #fff);
            --text: var(--chat-text, #333);
            font-family: 'Geist Sans', sans-serif;
        }
        .chat-toggle {
            position: fixed; bottom: 22px; right: 22px;
            width: 62px; height: 62px; border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white; border: none; cursor: pointer;
            box-shadow: 0 6px 18px rgba(0,0,0,0.25);
            font-size: 26px;
            transition: .25s ease;
            display: flex; justify-content: center; align-items: center;
            z-index: 9999;
        }
        .chat-toggle:hover { transform: scale(1.08); }

        .chat-container {
            position: fixed; bottom: 22px; right: 22px;
            width: 380px; height: 600px;
            border-radius: 16px; overflow: hidden;
            background: var(--bg);
            box-shadow: 0 8px 26px rgba(0,0,0,0.15);
            display: flex; flex-direction: column;
            opacity: 0; pointer-events: none;
            transform: translateY(20px);
            transition: opacity .3s ease, transform .3s ease;
            z-index: 9998;
        }
        .chat-container.open {
            opacity: 1; pointer-events: auto;
            transform: translateY(0);
        }

        .chat-header {
            padding: 16px; display: flex; align-items: center; gap: 10px;
            background: var(--bg);
            border-bottom: 1px solid rgba(0,0,0,0.07);
        }
        .chat-header img { width: 30px; height: 30px; }
        .chat-header span { font-weight: 600; font-size: 17px; }
        .chat-close { margin-left: auto; cursor: pointer; opacity: .55; font-size: 22px; }
        .chat-close:hover { opacity: 1; }

        .chat-body { flex: 1; overflow-y: auto; padding: 22px; display: flex; flex-direction: column; gap: 12px; }

        .msg {
            max-width: 78%; padding: 12px 16px; border-radius: 12px;
            font-size: 14px; line-height: 1.45;
        }
        .msg.user {
            align-self: flex-end;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
        }
        .msg.bot {
            align-self: flex-start;
            background: var(--bg);
            border: 1px solid rgba(0,0,0,0.08);
        }

        .chat-input {
            display: flex; gap: 8px;
            padding: 16px;
            border-top: 1px solid rgba(0,0,0,0.07);
        }
        .chat-input textarea {
            flex: 1; border-radius: 10px;
            border: 1px solid rgba(0,0,0,0.15);
            resize: none; padding: 10px;
            font-size: 14px;
        }
        .chat-input button {
            padding: 0 20px;
            border-radius: 10px;
            border: none; cursor: pointer;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white; font-weight: 600;
        }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);


    /************************************
     * 2. MERGE USER CONFIG
     ************************************/
    const cfg = window.ChatWidgetConfig;

    const themeVars = {
        "--chat-primary": cfg.style.primaryColor,
        "--chat-secondary": cfg.style.secondaryColor,
        "--chat-bg": cfg.style.backgroundColor,
        "--chat-text": cfg.style.fontColor,
    };


    /************************************
     * 3. BUILD CHAT WIDGET DOM
     ************************************/
    const container = document.createElement("div");
    container.className = "chat-container";

    Object.entries(themeVars).forEach(([k, v]) => container.style.setProperty(k, v));

    container.innerHTML = `
        <div class="chat-header">
            <img src="${cfg.branding.logo}" />
            <span>${cfg.branding.name}</span>
            <div class="chat-close">×</div>
        </div>

        <div class="chat-body"></div>

        <div class="chat-input">
            <textarea placeholder="Escribe tu mensaje..."></textarea>
            <button>Enviar</button>
        </div>
    `;

    const toggle = document.createElement("button");
    toggle.className = "chat-toggle";
    toggle.innerHTML = "💬";

    document.body.appendChild(toggle);
    document.body.appendChild(container);

    const body = container.querySelector(".chat-body");
    const textarea = container.querySelector("textarea");
    const sendBtn = container.querySelector("button");


    /************************************
     * 4. MESSAGE HELPERS
     ************************************/
    const addMsg = (text, type) => {
        const div = document.createElement("div");
        div.className = `msg ${type}`;
        div.textContent = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    };


    /************************************
     * 5. BACKEND COMMUNICATION
     ************************************/
    let sessionId = crypto.randomUUID();

    async function sendToBot(message) {
        const payload = {
            action: "sendMessage",
            sessionId,
            route: cfg.webhook.route,
            chatInput: message,
            metadata: { userId: "" }
        };

        const res = await fetch(cfg.webhook.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        return await res.json();
    }


    /************************************
     * 6. EVENT HANDLERS
     ************************************/
    toggle.addEventListener("click", () => {
        container.classList.toggle("open");
    });

    container.querySelector(".chat-close").addEventListener("click", () => {
        container.classList.remove("open");
    });

    sendBtn.addEventListener("click", async () => {
        const msg = textarea.value.trim();
        if (!msg) return;

        addMsg(msg, "user");
        textarea.value = "";

        const response = await sendToBot(msg);
        const botReply = Array.isArray(response) ? response[0].output : response.output;

        addMsg(botReply, "bot");
    });

    textarea.addEventListener("keypress", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

});
