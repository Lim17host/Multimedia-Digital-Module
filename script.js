window.onload = function() {
    const savedName = localStorage.getItem('student_name');
    const savedSection = localStorage.getItem('student_section');
    if (savedName && savedSection) {
        const loginOverlay = document.getElementById('login-overlay');
        const displayInfo = document.getElementById('display-student-info');
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (displayInfo) displayInfo.innerText = `${savedName} (${savedSection})`;
    }
};

function handleLogin(event) {
    event.preventDefault();
    const nameInput = document.getElementById('input-name');
    const sectionInput = document.getElementById('input-section');
    
    if (!nameInput || !sectionInput) return;
    
    const name = nameInput.value.trim();
    const section = sectionInput.value.trim();

    if (name && section) {
        localStorage.setItem('student_name', name);
        localStorage.setItem('student_section', section);
        const loginOverlay = document.getElementById('login-overlay');
        const displayInfo = document.getElementById('display-student-info');
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (displayInfo) displayInfo.innerText = `${name} (${section})`;
    }
}

// Para sa awtomatikong pag-log out
function handleLogout() {
    localStorage.removeItem('student_name');
    localStorage.removeItem('student_section');
    
    const nameInput = document.getElementById('input-name');
    const sectionInput = document.getElementById('input-section');
    if (nameInput) nameInput.value = '';
    if (sectionInput) sectionInput.value = '';
    
    const loginOverlay = document.getElementById('login-overlay');
    if (loginOverlay) loginOverlay.style.display = 'flex';
    
    closeModal();
}

const puzzleGrid = [
    ['A', 'G', 'D', 'A', 'G', 'E', 'G', 'E', 'Q', 'L', 'P'],
    ['H', 'S', 'E', 'I', 'B', 'I', 'G', 'A', 'P', 'A', 'A'],
    ['A', 'R', 'M', 'R', 'A', 'L', 'B', 'A', 'N', 'K', 'N'],
    ['Y', 'I', 'A', 'P', 'I', 'R', 'U', 'A', 'L', 'T', 'L'],
    ['D', 'N', 'N', 'H', 'J', 'U', 'N', 'C', 'B', 'B', 'A'],
    ['E', 'D', 'D', 'C', 'U', 'R', 'V', 'E', 'K', 'O', 'S'],
    ['M', 'Z', 'U', 'F', 'L', 'C', 'N', 'V', 'U', 'H', 'A'],
    ['A', 'V', 'R', 'A', 'W', 'U', 'A', 'S', 'R', 'F', 'P'],
    ['N', 'R', 'P', 'C', 'Y', 'N', 'R', 'W', 'B', 'K', 'P'],
    ['D', 'F', 'U', 'N', 'C', 'T', 'I', 'O', 'N', 'P', 'P'],
    ['A', 'K', 'I', 'T', 'A', 'R', 'E', 'P', 'N', 'O', 'K']
];

const targetWords = {
    'DEMAND': [[4,0], [5,0], [6,0], [7,0], [8,0], [9,0]],
    'CURVE': [[5,3], [5,4], [5,5], [5,6], [5,7]],
    'KITA': [[10,1], [10,2], [10,3], [10,4]],
    'FUNCTION': [[9,1], [9,2], [9,3], [9,4], [9,5], [9,6], [9,7], [9,8]]
};

let selectedCells = [];
let foundWords = new Set();

function openModal(key) {
    const sections = document.querySelectorAll('.modal-section');
    sections.forEach(sec => sec.style.display = 'none');

    const activeSection = document.getElementById('content-' + key);
    if(activeSection) {
        activeSection.style.display = 'block';
    }

    const modal = document.getElementById('modal');
    if(modal) modal.style.display = 'block';
    
    if (key === 'balikan') renderPuzzle();
    restoreInputs();
}

function closeModal() {
    const modal = document.getElementById('modal');
    if(modal) modal.style.display = 'none';
}

document.addEventListener('input', function(e) {
    if (e.target.classList.contains('saved-input') || e.target.classList.contains('user-input')) {
        if (e.target.dataset.id) {
            localStorage.setItem(e.target.dataset.id, e.target.value);
        }
    }
});

function restoreInputs() {
    const inputs = document.querySelectorAll('.saved-input, .user-input');
    inputs.forEach(input => {
        const id = input.dataset.id;
        if (id && localStorage.getItem(id) !== null) {
            input.value = localStorage.getItem(id);
            if(input.classList.contains('user-input')) {
                checkAnswer(input);
            }
        }
    });
}

function submitAndDownload() {
    const name = localStorage.getItem('student_name') || 'Mag-aaral';
    const section = localStorage.getItem('student_section') || 'Walang Seksiyon';

    let report = `=========================================\n`;
    report += ` ULAT NG MGA SAGOT - ARALING PANLIPUNAN 9\n`;
    report += `=========================================\n`;
    report += `Pangalan: ${name}\n`;
    report += `Seksiyon: ${section}\n`;
    report += `Petsa / Oras: ${new Date().toLocaleString()}\n`;
    report += `=========================================\n\n`;

    report += `--- TUKLASIN (4 PICS 1 WORD) & PAMPROSESONG TANONG ---\n`;
    report += `4 Pics 1 Word - Paninda (Letra 1): ${localStorage.getItem('pic1_1') || ''}\n`;
    report += `4 Pics 1 Word - Paninda (Letra 2): ${localStorage.getItem('pic1_2') || ''}\n`;
    report += `4 Pics 1 Word - Paninda (Letra 3): ${localStorage.getItem('pic1_3') || ''}\n`;
    report += `4 Pics 1 Word - Negosyante (Letra 1): ${localStorage.getItem('pic2_1') || ''}\n`;
    report += `4 Pics 1 Word - Negosyante (Letra 2): ${localStorage.getItem('pic2_2') || ''}\n`;
    report += `4 Pics 1 Word - Negosyante (Letra 3): ${localStorage.getItem('pic2_3') || ''}\n`;
    report += `4 Pics 1 Word - Negosyante (Letra 4): ${localStorage.getItem('pic2_4') || ''}\n`;
    report += `4 Pics 1 Word - Negosyante (Letra 5): ${localStorage.getItem('pic2_5') || ''}\n`;
    report += `4 Pics 1 Word - Produksyon (Letra 1): ${localStorage.getItem('pic3_1') || ''}\n`;
    report += `4 Pics 1 Word - Produksyon (Letra 2): ${localStorage.getItem('pic3_2') || ''}\n`;
    report += `4 Pics 1 Word - Produksyon (Letra 3): ${localStorage.getItem('pic3_3') || ''}\n`;
    report += `4 Pics 1 Word - Produksyon (Letra 4): ${localStorage.getItem('pic3_4') || ''}\n`;
    report += `4 Pics 1 Word - Pamilihan (Letra 1): ${localStorage.getItem('pic4_1') || ''}\n`;
    report += `4 Pics 1 Word - Pamilihan (Letra 2): ${localStorage.getItem('pic4_2') || ''}\n\n`;

    report += `Pamprosesong Tanong 1: ${localStorage.getItem('pampro_1') || ''}\n`;
    report += `Pamprosesong Tanong 2: ${localStorage.getItem('pampro_2') || ''}\n`;
    report += `Pamprosesong Tanong 3: ${localStorage.getItem('pampro_3') || ''}\n\n`;

    report += `--- PAGYAMANIN GAWAIN 1 (SA-KAT-HA) ---\n`;
    for(let r = 1; r <= 5; r++) {
        report += `Row ${r} - Salik: ${localStorage.getItem(`g1_r${r}_c1`) || ''} | Katangian: ${localStorage.getItem(`g1_r${r}_c2`) || ''} | Halimbawa: ${localStorage.getItem(`g1_r${r}_c3`) || ''}\n`;
    }

    report += `\n--- PAGYAMANIN GAWAIN 2 (DESISYON MO) ---\n`;
    report += `Tanong 1: ${localStorage.getItem('g2_q1') || ''}\n`;
    report += `Tanong 2: ${localStorage.getItem('g2_q2') || ''}\n`;
    report += `Tanong 3: ${localStorage.getItem('g2_q3') || ''}\n`;

    // IPINADALA DIREKTA SA FORMSPREE EMAIL NG GURO
    fetch('https://formspree.io/f/ILAGAY_MO_DITO_ANG_ENDPOINT_MO', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            section: section,
            message: report
        })
    }).then(response => {
        if (response.ok) {
            alert(`Tagumpay! Nai-send na ang iyong mga sagot kay Sir/Ma'am.`);
            // Kusang mag-lalog out pagkatapos ma-send
            handleLogout();
        } else {
            alert('Nagkaproblema sa pag-send. Subukang muli.');
        }
    }).catch(error => {
        alert('May error sa koneksyon sa internet.');
    });
}

function renderPuzzle() {
    const gridContainer = document.getElementById('grid');
    if(!gridContainer) return;
    gridContainer.innerHTML = '';
    selectedCells = [];
    foundWords.clear();

    for (let r = 0; r < 11; r++) {
        for (let c = 0; c < 11; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.innerText = puzzleGrid[r][c];
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => toggleCell(cell, r, c);
            gridContainer.appendChild(cell);
        }
    }
}

function toggleCell(cell, r, c) {
    const index = selectedCells.findIndex(item => item.r === r && item.c === c);
    if (index > -1) {
        selectedCells.splice(index, 1);
        if (!cell.classList.contains('found')) cell.classList.remove('selected');
    } else {
        selectedCells.push({ r, c, cell });
        cell.classList.add('selected');
    }
    checkWords();
}

function checkWords() {
    for (let word in targetWords) {
        if (foundWords.has(word)) continue;
        const coords = targetWords[word];
        const isWordComplete = coords.every(coord => 
            selectedCells.some(selected => selected.r === coord[0] && selected.c === coord[1])
        );
        if (isWordComplete) {
            foundWords.add(word);
            coords.forEach(coord => {
                const cellEl = document.querySelector(`.grid-cell[data-row="${coord[0]}"][data-col="${coord[1]}"]`);
                if (cellEl) {
                    cellEl.classList.remove('selected');
                    cellEl.classList.add('found');
                }
            });
            const wordEl = document.getElementById(`word-${word}`);
            if (wordEl) wordEl.classList.add('found-word');
        }
    }
}

function resetPuzzle() {
    renderPuzzle();
    for (let word in targetWords) {
        const el = document.getElementById(`word-${word}`);
        if (el) el.classList.remove('found-word');
    }
}

function checkAnswer(inputEl) {
    const parent = inputEl.parentElement;
    if (!parent) return;
    const targetAnswer = parent.dataset.answer;
    const inputs = Array.from(parent.querySelectorAll('.letter-box'));
    if (inputEl.value.length === 1) {
        const nextInput = inputs[inputs.indexOf(inputEl) + 1];
        if (nextInput && !nextInput.hasAttribute('readonly')) nextInput.focus();
    }
    const currentAnswer = inputs.map(i => i.value.toUpperCase()).join('');
    
    const cardStatus = parent.closest('.game-card') || parent.parentElement;
    const statusEl = cardStatus ? cardStatus.querySelector('.card-status') : null;
    
    if (currentAnswer.length === targetAnswer.length) {
        if (currentAnswer === targetAnswer) {
            inputs.forEach(i => { i.classList.remove('wrong'); i.classList.add('correct'); });
            if (statusEl) {
                statusEl.style.color = '#34d399';
                statusEl.innerHTML = '✓ TAMA ANG SAGOT!';
            }
        } else {
            inputs.forEach(i => { if(!i.classList.contains('given')) i.classList.add('wrong'); });
            if (statusEl) {
                statusEl.style.color = '#f87171';
                statusEl.innerHTML = '✗ MALI, SUBUKAN ULI';
            }
        }
    } else {
        inputs.forEach(i => i.classList.remove('correct', 'wrong'));
        if (statusEl) statusEl.innerHTML = '';
    }
}