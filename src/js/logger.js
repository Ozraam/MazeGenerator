/**
 * Utility function for logging messages to the status display element.
 * Takes multiple message arguments and displays them as paragraphs in the status area.
 * @param {...string} messages - Variable number of message strings to display
 */
export function logToStatus(...messages) {
    document.getElementById('status').innerHTML = messages.map(message => `<p>${message}</p>`).join('');
}