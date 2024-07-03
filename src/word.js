document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchWordOfTheDay').addEventListener('click', fetchWordOfTheDay);
    document.getElementById('deleteWordOfTheDay').addEventListener('click', deleteWordOfTheDay);
    fetchWordOfTheDay(); // Fetch initial word of the day on page load
});

function fetchWordOfTheDay() {
    const url = 'https://random-word-api.herokuapp.com/word?number=1';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const word = data[0];
            fetchAndDisplayWord(word);
        })
        .catch(error => {
            document.getElementById('definition').innerHTML = `<p class="error">Error: ${error.message}</p>`;
        });
}

function fetchAndDisplayWord(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const wordData = {
                word: data[0].word,
                phonetics: data[0].phonetics[0]?.audio || '',
                meanings: data[0].meanings
            };

            localStorage.setItem('wordOfTheDay', JSON.stringify(wordData));
            displayWordOfTheDay(wordData);
        })
        .catch(error => {
            document.getElementById('definition').innerHTML = `<p class="error">Error: ${error.message}</p>`;
        });
}

function displayWordOfTheDay(wordData) {
    const wordOfTheDayDiv = document.getElementById('wordOfTheDay');
    wordOfTheDayDiv.innerHTML = '';

    const wordTitle = document.createElement('h2');
    wordTitle.textContent = `Word of the Day: ${wordData.word}`;
    wordOfTheDayDiv.appendChild(wordTitle);

    if (wordData.phonetics) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = wordData.phonetics;
        audio.className = 'audio';
        wordOfTheDayDiv.appendChild(audio);
    }

    const definitionDiv = document.getElementById('definition');
    definitionDiv.innerHTML = '';

    wordData.meanings.forEach(meaning => {
        const partOfSpeechHeader = document.createElement('h3');
        partOfSpeechHeader.textContent = meaning.partOfSpeech;
        definitionDiv.appendChild(partOfSpeechHeader);

        meaning.definitions.forEach(definition => {
            const def = document.createElement('p');
            def.textContent = `Definition: ${definition.definition}`;
            definitionDiv.appendChild(def);

            if (definition.example) {
                const example = document.createElement('p');
                example.textContent = `Example: ${definition.example}`;
                definitionDiv.appendChild(example);
            }

            if (definition.antonyms.length > 0) {
                const antonyms = document.createElement('p');
                antonyms.textContent = `Antonyms: ${definition.antonyms.join(', ')}`;
                definitionDiv.appendChild(antonyms);
            }
        });
    });
}

function deleteWordOfTheDay() {
    localStorage.removeItem('wordOfTheDay');
    document.getElementById('wordOfTheDay').innerHTML = '';
    document.getElementById('definition').innerHTML = '<p>Word of the day deleted.</p>';
}
