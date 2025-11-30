// Chat Widget Script (estilo NARANJA + BLANCO, typing WhatsApp)
(function () {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat-primary: #ffa22b;
            --chat-background: #ffffff;
            --chat-font: #333333;
            font-family: 'Geist Sans', sans-serif;
        }

        /* CONTENEDOR */
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            border: 1px solid rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        /* HEADER */
        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--chat-primary);
            color: white;
            position: relative;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 600;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
            border-radius: 8px;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: white;
            font-size: 22px;
            cursor: pointer;
            opacity: 0.8;
        }

        .n8n-chat-widget .close-button:hover { opacity: 1; }

        /* PANTALLA INICIAL */
        .n8n-chat-widget .new-conversation {
            text-align: center;
            padding: 40px 20px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 700;
            color: var(--chat-font);
        }

        .n8n-chat-widget .new-chat-btn {
            width: 100%;
            padding: 16px;
            margin-top: 20px;
            background: var(--chat-primary);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            justify-content: center;
            gap: 10px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            filter: brightness(1.1);
        }

        /* MENSAJES */
        .n8n-chat-widget .chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: var(--chat-background);
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            font-size: 15px;
            line-height: 1.4;
        }

        /* USUARIO → naranja */
        .n8n-chat-widget .chat-message.user {
            background: var(--chat-primary);
            color: white;
            align-self: flex-end;
        }

        /* BOT → blanco */
        .n8n-chat-widget .chat-message.bot {
            background: white;
            border: 1px solid rgba(0,0,0,0.1);
            color: var(--chat-font);
            align-self: flex-start;
        }

        /* INPUT */
        .n8n-chat-widget .chat-input {
            padding: 12px;
            border-top: 1px solid rgba(0,0,0,0.1);
            display: flex;
            gap: 8px;
            background: white;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            border: 1px solid rgba(0,0,0,0.2);
            border-radius: 8px;
            padding: 10px;
            resize: none;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-input button {
            background: var(--chat-primary);
            border: none;
            padding: 0 20px;
            border-radius: 8px;
            cursor: pointer;
            color: white;
            font-size: 15px;
            font-weight: 600;
        }

        /* BOTÓN FLOTANTE → naranja */
        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: var(--chat-primary);
            border: none;
            cursor: pointer;
            color: white;
            font-size: 24px;
        }

        /* === TYPING INDICATOR (WhatsApp) === */
        .typing-indicator {
            display: flex;
            gap: 5px;
            align-self: flex-start;
            margin: 4px 0 4px 0;
        }
        .typing-indicator span {
            width: 8px;
            height: 8px;
            background: var(--chat-primary);
            border-radius: 50%;
            animation: typing 1.4s infinite both;
        }
        .typing-indicator span:nth-child(2) { animation-delay: .2s }
        .typing-indicator span:nth-child(3) { animation-delay: .4s }

        @keyframes typing {
            0% { transform: translateY(0); opacity: .3 }
            50% { transform: translateY(-4px); opacity: 1 }
            100% { transform: translateY(0); opacity: .3 }
        }
    `;

    // Inject font + style
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css";
    document.head.appendChild(fontLink);

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    /* --------------------------
       CONFIGURACIÓN DEL WIDGET
    ----------------------------*/
    const config = window.ChatWidgetConfig;

    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "n8n-chat-widget";

    const chatContainer = document.createElement("div");
    chatContainer.className = "chat-container";

    /* HTML estructura */
    chatContainer.innerHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>

        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                <span>💬</span> Empezar chat
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>

        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>

            <div class="chat-messages"></div>

            <div class="chat-input">
                <textarea placeholder="Escribe tu mensaje..." rows="1"></textarea>
                <button>Enviar</button>
            </div>
        </div>
    `;

    /* AÑADIR TOGGLE BUTTON */
    const toggleButton = document.createElement("button");
    toggleButton.className = "chat-toggle";
    toggleButton.innerHTML = "💬";

    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    /* REFERENCIAS */
    const newChatBtn = chatContainer.querySelector(".new-chat-btn");
    const chatInterface = chatContainer.querySelector(".chat-interface");
    const messagesContainer = chatContainer.querySelector(".chat-messages");
    const textarea = chatContainer.querySelector("textarea");
    const sendButton = chatContainer.querySelector(".chat-input button");

    function parseMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>");
    }

    /* INICIAR CHAT */
    async function startNewConversation() {
        currentSessionId = crypto.randomUUID();

        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: { userId: "" }
        }];

        const res = await fetch(config.webhook.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        chatContainer.querySelector(".new-conversation").style.display = "none";
        chatInterface.classList.add("active");

        const botMsg = document.createElement("div");
        botMsg.className = "chat-message bot";
        botMsg.innerHTML = parseMarkdown(
            (Array.isArray(json) ? json[0].output : json.output)
        );
        messagesContainer.appendChild(botMsg);
    }

    /* ENVIAR MENSAJE */
    async function sendMessage(msg) {
        const userMsg = document.createElement("div");
        userMsg.className = "chat-message user";
        userMsg.textContent = msg;
        messagesContainer.appendChild(userMsg);

        // INDICADOR TYPING
        const typing = document.createElement("div");
        typing.className = "typing-indicator";
        typing.innerHTML = "<span></span><span></span><span></span>";
        messagesContainer.appendChild(typing);

        const payload = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: msg,
            metadata: { userId: "" }
        };

        const res = await fetch(config.webhook.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const json = await res.json();

        typing.remove();

        const botMsg = document.createElement("div");
        botMsg.className = "chat-message bot";
        botMsg.innerHTML = parseMarkdown(
            (Array.isArray(json) ? json[0].output : json.output)
        );
        messagesContainer.appendChild(botMsg);
    }

    /* EVENTOS */
    newChatBtn.onclick = startNewConversation;

    sendButton.onclick = () => {
        if (textarea.value.trim()) {
            sendMessage(textarea.value.trim());
            textarea.value = "";
        }
    };

    textarea.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    toggleButton.onclick = () => chatContainer.classList.toggle("open");

    chatContainer.querySelectorAll(".close-button")
        .forEach(b => b.onclick = () => chatContainer.classList.remove("open"));
})();
