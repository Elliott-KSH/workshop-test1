const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteButton = document.getElementById('new-quote-button');
const copyQuoteButton = document.getElementById('copy-quote-button');
const themeToggle = document.getElementById('theme-toggle');
const langKoButton = document.getElementById('lang-ko');
const langEnButton = document.getElementById('lang-en');

let currentLang = 'ko';

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
        element.textContent = translations[lang][key];
    });
    displayQuote();
}

function getRandomQuote() {
    const quotes = translations[currentLang].quotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function displayQuote() {
    const { quote, author } = getRandomQuote();
    quoteText.textContent = `“${quote}”`;
    quoteAuthor.textContent = `- ${author}`;
}

copyQuoteButton.addEventListener('click', () => {
    const quoteToCopy = quoteText.textContent;
    const authorToCopy = quoteAuthor.textContent;
    const fullText = `${quoteToCopy} ${authorToCopy}`;

    navigator.clipboard.writeText(fullText).then(() => {
        // Provide feedback to the user
        const originalText = copyQuoteButton.textContent;
        copyQuoteButton.textContent = translations[currentLang].copied_text;
        setTimeout(() => {
            copyQuoteButton.textContent = originalText;
        }, 1500); // Revert back after 1.5 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

newQuoteButton.addEventListener('click', displayQuote);

langKoButton.addEventListener('click', () => setLanguage('ko'));
langEnButton.addEventListener('click', () => setLanguage('en'));

// Display initial quote on page load
setLanguage(currentLang);

