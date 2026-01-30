const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteButton = document.getElementById('new-quote-button');
const themeToggle = document.getElementById('theme-toggle');

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


const quotes = [
    {
        quote: "유일한 참된 지혜는 당신이 아무것도 모른다는 것을 아는 것입니다.",
        author: "소크라테스"
    },
    {
        quote: "나는 생각한다, 그러므로 나는 존재한다.",
        author: "르네 데카르트"
    },
    {
        quote: "인간은 자유롭도록 저주받았다.",
        author: "장 폴 사르트르"
    },
    {
        quote: "성찰하지 않는 삶은 살 가치가 없다.",
        author: "소크라테스"
    },
    {
        quote: "우리는 우리가 반복적으로 하는 것입니다. 그렇다면 탁월함은 행동이 아니라 습관입니다.",
        author: "아리스토텔레스"
    },
    {
        quote: "신은 죽었다.",
        author: "프리드리히 니체"
    },
    {
        quote: "행복은 이성의 이상이 아니라 상상의 이상이다.",
        author: "임마누엘 칸트"
    },
    {
        quote: "너 자신을 알라.",
        author: "소크라테스"
    },
    {
        quote: "행복은 목표가 아니라, 행복한 삶을 추구하는 과정에서 얻어지는 결과물이다.",
        author: "아리스토텔레스"
    }
];

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function displayQuote() {
    const { quote, author } = getRandomQuote();
    quoteText.textContent = `“${quote}”`;
    quoteAuthor.textContent = `- ${author}`;
}

newQuoteButton.addEventListener('click', displayQuote);

// Display initial quote on page load
displayQuote();
