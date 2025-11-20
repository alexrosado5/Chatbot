const css = `
.n8n-chat-widget {
    --primary: var(--chat-primary, #ffa22b);
    --secondary: var(--chat-secondary, #e17a00);
    --bg: var(--chat-bg, #ffffff);
    --text: var(--chat-text, #333);
    --radius: 14px;
    font-family: 'Geist Sans', sans-serif;
}

/* Toggle button */
.chat-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: #fff;
    font-size: 28px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    transition: transform .2s ease, box-shadow .2s ease;
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
    box-shadow: 0 16px 32px rgba(0,0,0,0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.chat-container.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
}

/* Header */
.chat-header {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 10px;
    border-bottom: 1px solid #eee;
}
.chat-header img {
    width: 34px;
    height: 34px;
    border-radius: 10px;
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

/* Message area */
.chat-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #fafafa;
}

/* GENERAL MESSAGE STYLE */
.msg {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: var(--radius);
    font-size: 15px;
    line-height: 1.45;
    animation: fadeIn 0.2s ease forwards;
}

/* USER MESSAGE (orange bubble, white text) */
.msg.user {
    align-self: flex-end;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: #fff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}

/* BOT MESSAGE (white bubble with shadow) */
.msg.bot {
    align-self: flex-start;
    background: white;
    color: var(--text);
    border: 1px solid rgba(0,0,0,0.06);
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Input */
.chat-input {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px;
    border-top: 1px solid #eee;
    background: #fff;
}
.chat-input textarea {
    flex: 1;
    border-radius: 10px;
    padding: 12px;
    border: 1px solid #ddd;
    resize: none;
    font-size: 14px;
}
.chat-input button {
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    font-weight: 600;
}

/* Animation */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
