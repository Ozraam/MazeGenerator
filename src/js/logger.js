export function logToStatus(...messages) {
    document.getElementById('status').innerHTML = messages.map(message => `<p>${message}</p>`).join('');
}