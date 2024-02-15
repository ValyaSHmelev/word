const appData = {
    wordLength: 5,
    currentRow: 1,
    colors: {
        red: 'red',
        orange: 'orange',
        green: 'green'
    }
}

document.querySelector('#app-container').style.width = appData.wordLength * 50 + 'px'
document.getElementById('word-input').setAttribute('maxlength', String(appData.wordLength))

const secretWord = getRandomWordWithLengthN(wordsDB, appData.wordLength)

const table = new Tabulator('#table', {
    layout: "fitColumns",
    rowHeight: 40,
    maxHeight: "calc(100vh - 75px)",
    columnDefaults: {
        vertAlign: "middle",
        headerSort: false,
        headerHozAlign: "center",
        hozAlign: "center",
        resizable: false,
    },
    columns: Array.from({ length: appData.wordLength }, (_, i) => ({ title: i + 1 })),
    data: Array.from({ length: 6 }, (_, i) => ({})),
    rowContextMenu: [

    ]
})

function checkFullness(row) {
    const rowData = row.getData()
    const values = Object.values(rowData)
    return values.length === values.filter(x => x).length
}

function getRandomWordWithLengthN(words, N) {
    const wordsWithLengthN = words.filter(word => word.length === N);
    const randomIndex = Math.floor(Math.random() * wordsWithLengthN.length);
    return wordsWithLengthN[randomIndex].toLowerCase();
}

function checkWord() {
    try {
        const currentRow = table.getRowFromPosition(appData.currentRow)

        if (!checkFullness(currentRow)) throw new Error("Необходимно ввести слово полностью")

        const inputWord = document.getElementById('word-input').value.trim().toLowerCase()

        if (!glossaryCheck(inputWord)) throw new Error(`Слово ${inputWord} не найдено в словаре`)

        for (const [i, letterCell] of currentRow.getCells().entries()) {
            const $letterCell = letterCell.getElement()
            const letter = letterCell.getValue()
            let $key
            document.querySelectorAll('.key').forEach(key => {
                if (key.innerText.toLowerCase() === letter) {
                    $key = key
                }
            })

            if (secretWord.includes(letter)) {
                $letterCell.style.backgroundColor = appData.colors.orange
                if ($key) {
                    $key.style.backgroundColor = appData.colors.orange
                }

            } else {
                $letterCell.style.backgroundColor = appData.colors.red
                if ($key) {
                    $key.style.backgroundColor = appData.colors.red
                }

            }

            if (secretWord[i] === letter) {
                $letterCell.style.backgroundColor = appData.colors.green
                if ($key) {
                    $key.style.backgroundColor = appData.colors.green
                }

            }
        }

        appData.currentRow++

        document.getElementById('word-input').value = ''

        if (inputWord === secretWord) {
            alert('Поздравляем! Вы отгадали слово!')
        }


    } catch (error) {
        console.error(error);
        alert(error.message)
    }
}

table.on("tableBuilt", function () {

    document.getElementById('word-input').addEventListener('input', (e) => {
        const inputString = e.target.value
        const currentRow = this.getRowFromPosition(appData.currentRow)
        const cells = currentRow.getCells()

        cells.forEach(cell => cell.setValue(''))

        inputString.split('').forEach((letter, i) => {
            cells[i].setValue(letter)
        });
    })

    document.getElementById('word-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            checkWord()
        }
    })
});

