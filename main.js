const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteButton = document.getElementById('new-quote-button');
const copyQuoteButton = document.getElementById('copy-quote-button');
const themeToggle = document.getElementById('theme-toggle');
const langKoButton = document.getElementById('lang-ko');
const langEnButton = document.getElementById('lang-en');

let currentLang = 'ko';
let currentQuoteData = null; // Store the currently displayed quote object

// Theme switcher logic
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-translate-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate-key');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
            // Fallback for missing translation - optional: log a warning or use default
            console.warn(`Missing translation for key: ${key} in language: ${lang}`);
        }
    });
    // Only translate the current quote, don't fetch a new one
    if (currentQuoteData) {
        displaySpecificQuote(currentQuoteData);
    }
}

function getRandomQuoteObject() {
    const quotes = translations[currentLang].quotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function displaySpecificQuote(quoteObject) {
    quoteText.textContent = `“${quoteObject.quote}”`;
    quoteAuthor.textContent = `- ${quoteObject.author}`;
}

function displayNewRandomQuote() {
    currentQuoteData = getRandomQuoteObject();
    displaySpecificQuote(currentQuoteData);
}

copyQuoteButton.addEventListener('click', () => {
    const quoteToCopy = quoteText.textContent;
    const authorToCopy = quoteAuthor.textContent;
    const fullText = `${quoteToCopy} ${authorToCopy}`;

    navigator.clipboard.writeText(fullText).then(() => {
        // Provide feedback to the user
        copyQuoteButton.textContent = translations[currentLang].copied_text;
        setTimeout(() => {
            copyQuoteButton.textContent = translations[currentLang].copy_quote_button;
        }, 1500); // Revert back after 1.5 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

newQuoteButton.addEventListener('click', displayNewRandomQuote);

langKoButton.addEventListener('click', () => setLanguage('ko'));
langEnButton.addEventListener('click', () => setLanguage('en'));

// Display initial quote on page load
// Set initial language first to ensure translations are loaded before displaying quote
setLanguage(currentLang);
displayNewRandomQuote(); // Display a random quote after setting initial language

