document.getElementById('fetchButton').addEventListener('click', () => {
    const word = document.getElementById('wordInput').value;
    const partOfSpeech = document.getElementById('partOfSpeech').value;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const definitionDiv = document.getElementById('definition');
            definitionDiv.innerHTML = '';

            const wordData = data[0];
            const wordTitle = document.createElement('h2');
            wordTitle.textContent = wordData.word;
            definitionDiv.appendChild(wordTitle);

            if (wordData.phonetics.length > 0) {
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = wordData.phonetics[0].audio;
                audio.className = 'audio';
                definitionDiv.appendChild(audio);
            }

            wordData.meanings.forEach(meaning => {
                if (partOfSpeech === '' || meaning.partOfSpeech === partOfSpeech) {
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
                }
            });

            if (wordData.sourceUrls && wordData.sourceUrls.length > 0) {
                const sourceUrl = document.createElement('a');
                sourceUrl.href = wordData.sourceUrls[0];
                sourceUrl.textContent = 'More information';
                sourceUrl.target = '_blank';
                definitionDiv.appendChild(sourceUrl);
            }

            if (definitionDiv.innerHTML === '') {
                definitionDiv.innerHTML = `<p class="error">No definition found for "${word}" with the specified part of speech.</p>`;
            }
        })
        .catch(error => {
            document.getElementById('definition').innerHTML = `<p class="error">Error: ${error.message}</p>`;
        });
});
