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
