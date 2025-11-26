// Chat Widget Script
(function () {

    /* ------------------------------ ESTILOS ------------------------------ */

    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        @keyframes message-appear {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            height: 600px;
            display: none;
            background: var(--chat--color-background);
            border-radius: 12px;
            padding: 0;
            border: 1px solid rgba(0,0,0,0.15);
            box-shadow: 0 8px 30px rgba(0,0,0,0.18);
            overflow: hidden;
            z-index: 9999;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
            border-radius: 6px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 600;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .close-button {
            margin-left: auto;
            cursor: pointer;
            background: none;
            border: none;
            font-size: 22px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover { opacity: 1; }

        .n8n-chat-widget .new-conversation {
            padding: 40px;
            text-align: center;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .n8n-chat-widget .new-chat-btn {
            width: 100%;
            padding: 14px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            color: #fff;
            background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary));
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            border-radius: 12px;
            margin: 6px 0;
            max-width: 80%;
            animation: message-appear 0.3s ease-out;
        }

        .n8n-chat-widget .chat-message.user {
            align-self: flex-end;
            background: var(--chat--color-primary);
            color: #fff;
        }

        .n8n-chat-widget .chat-message.bot {
            align-self: flex-start;
            background: #f2f2f2;
            color: #333;
        }

        .n8n-chat-widget .chat-input {
            padding: 12px;
            border-top: 1px solid rgba(0,0,0,0.1);
            background: #fff;
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget textarea {
            flex: 1;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid rgba(0,0,0,0.15);
            resize: none;
            font-size: 14px;
        }

        .n8n-chat-widget button[type="submit"] {
            padding: 0 18px;
            border-radius: 8px;
            background: var(--chat--color-primary);
            color: #fff;
            border: none;
            cursor: pointer;
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 58px;
            height: 58px;
            border-radius: 30px;
            border: none;
            cursor: pointer;
            background: var(--chat--color-primary);
            box-shadow: 0 8px 22px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 99999;
        }
    `;

    /* --------------------------- INJECT CSS --------------------------- */

    const styleTag = document.createElement("style");
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);

    /* --------------------------- CONFIG --------------------------- */

    const defaultConfig = {
        webhook: { url: "", route: "" },
        branding: {
            logo: "",
            name: "",
            welcomeText: "",
            responseTimeText: "",
            poweredBy: { text: "", link: "" }
        },
        style: {
            primaryColor: "#854fff",
            secondaryColor: "#6b3fd4",
            position: "right",
            backgroundColor: "#ffffff",
            fontColor: "#333333"
        }
    };

    const config = window.ChatWidgetConfig
        ? {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        }
        : defaultConfig;

    /* --------------------------- WIDGET STRUCTURE --------------------------- */

    const widget = document.createElement("div");
    widget.className = "n8n-chat-widget";

    widget.style.setProperty("--n8n-chat-primary-color", config.style.primaryColor);
    widget.style.setProperty("--n8n-chat-secondary-color", config.style.secondaryColor);
    widget.style.setProperty("--n8n-chat-background-color", config.style.backgroundColor);
    widget.style.setProperty("--n8n-chat-font-color", config.style.fontColor);

    widget.innerHTML = `
        <div class="chat-container">
            <div class="brand-header">
                <img src="${config.branding.logo}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>

            <div class="new-conversation">
                <h2 class="welcome-text">${config.branding.welcomeText}</h2>
                <button class="new-chat-btn">💬 Empezar chat</button>
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
                    <textarea placeholder="Escribe tu mensaje..."></textarea>
                    <button type="submit">Enviar</button>
                </div>
            </div>
        </div>

        <button class="chat-toggle">💬</button>
    `;

    document.body.appendChild(widget);

    /* --------------------------- LOGIC --------------------------- */

    const toggleBtn = widget.querySelector(".chat-toggle");
    const container = widget.querySelector(".chat-container");
    const newChatBtn = widget.querySelector(".new-chat-btn");
    const chatInterface = widget.querySelector(".chat-interface");
    const newConversation = widget.querySelector(".new-conversation");
    const closeButtons = widget.querySelectorAll(".close-button");

    const messages = widget.querySelector(".chat-messages");
    const textarea = widget.querySelector("textarea");
    const sendButton = widget.querySelector('button[type="submit"]');

    let sessionId = "";

    function uuid() {
        return crypto.randomUUID();
    }

    toggleBtn.onclick = () => container.classList.toggle("open");

    closeButtons.forEach(btn => btn.onclick = () => container.classList.remove("open"));

    newChatBtn.onclick = async () => {
        sessionId = uuid();

        newConversation.style.display = "none";
        chatInterface.classList.add("active");

        // Request initial bot message
        try {
            const res = await fetch(config.webhook.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([{
                    action: "loadPreviousSession",
                    sessionId,
                    route: config.webhook.route,
                    metadata: { userId: "" }
                }])
            });

            const data = await res.json();

            const botMsg = document.createElement("div");
            botMsg.className = "chat-message bot";
            botMsg.textContent = Array.isArray(data) ? data[0].output : data.output;
            messages.appendChild(botMsg);

            messages.scrollTop = messages.scrollHeight;

        } catch (e) {
            console.error(e);
        }
    };

    sendButton.onclick = async () => {
        const msg = textarea.value.trim();
        if (!msg) return;

        const userMsg = document.createElement("div");
        userMsg.className = "chat-message user";
        userMsg.textContent = msg;
        messages.appendChild(userMsg);
        textarea.value = "";

        messages.scrollTop = messages.scrollHeight;

        try {
            const res = await fetch(config.webhook.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "sendMessage",
                    sessionId,
                    route: config.webhook.route,
                    chatInput: msg,
                    metadata: { userId: "" }
                })
            });

            const data = await res.json();

            const botMsg = document.createElement("div");
            botMsg.className = "chat-message bot";
            botMsg.textContent = Array.isArray(data) ? data[0].output : data.output;

            messages.appendChild(botMsg);
            messages.scrollTop = messages.scrollHeight;

        } catch (err) {
            console.error(err);
        }
    };

})();
