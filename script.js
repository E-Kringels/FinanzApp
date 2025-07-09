const defaultStundenlohnHauptjob = 15;
const defaultStundenlohnNebenjob = 10;
let currentView = 'arbeitszeit';

function getCurrentMonthYear() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
}

function addArbeitszeitFeld(jobType, date = '', hours = '') {
    const targetDivId = (jobType === 'hauptjob') ? 'hauptjobArbeitszeiten' : 'nebenjobArbeitszeiten';
    const arbeitszeitenDiv = document.getElementById(targetDivId);
    const newEntry = document.createElement('div');
    newEntry.classList.add('entry-row');
    newEntry.innerHTML = `
        <label>Datum:</label>
        <input type="date" value="${date}">
        <label>Stunden:</label>
        <input type="number" value="${hours}" min="0">
        <button class="add-remove-btn remove">Entfernen</button>
    `;
    arbeitszeitenDiv.appendChild(newEntry);

    newEntry.querySelector('input[type="date"]').addEventListener('input', () => {
        saveAllData();
        if (jobType === 'hauptjob') updateCurrentHauptjobGehalt();
        else updateCurrentNebenjobGehalt();
    });
    newEntry.querySelector('input[type="number"]').addEventListener('input', () => {
        saveAllData();
        if (jobType === 'hauptjob') updateCurrentHauptjobGehalt();
        else updateCurrentNebenjobGehalt();
    });
    newEntry.querySelector('.add-remove-btn.remove').addEventListener('click', (event) => {
        removeEntry(event.target.closest('.entry-row'), jobType, 'arbeitszeit');
    });

    if (jobType === 'hauptjob') updateCurrentHauptjobGehalt();
    else updateCurrentNebenjobGehalt();
    saveAllData();
}

function addKostenFeld(name = '', amount = '') {
    const kostenDiv = document.getElementById('kosten');
    const newEntry = document.createElement('div');
    newEntry.classList.add('entry-row');
    newEntry.innerHTML = `
        <label>Bezeichnung:</label>
        <input type="text" placeholder="z.B. Miete, Strom" value="${name}">
        <label>Betrag (€):</label>
        <input type="number" value="${amount}" min="0">
        <button class="add-remove-btn remove">Entfernen</button>
    `;
    kostenDiv.appendChild(newEntry);
    newEntry.querySelector('input[type="text"]').addEventListener('input', saveAllData);
    newEntry.querySelector('input[type="number"]').addEventListener('input', saveAllData);
    newEntry.querySelector('.add-remove-btn.remove').addEventListener('click', (event) => {
        removeEntry(event.target.closest('.entry-row'), null, 'kosten');
    });
    updateCurrentKosten();
    saveAllData();
}

function addNebenkostenFeld(name = '', amount = '') {
    const nebenkostenDiv = document.getElementById('nebenkosten');
    const newEntry = document.createElement('div');
    newEntry.classList.add('entry-row');
    newEntry.innerHTML = `
        <label>Bezeichnung:</label>
        <input type="text" placeholder="z.B. Reparatur, Hobby" value="${name}">
        <label>Betrag (€):</label>
        <input type="number" value="${amount}" min="0">
        <button class="add-remove-btn remove">Entfernen</button>
    `;
    nebenkostenDiv.appendChild(newEntry);
    newEntry.querySelector('input[type="text"]').addEventListener('input', saveAllData);
    newEntry.querySelector('input[type="number"]').addEventListener('input', saveAllData);
    newEntry.querySelector('.add-remove-btn.remove').addEventListener('click', (event) => {
        removeEntry(event.target.closest('.entry-row'), null, 'nebenkosten');
    });
    updateCurrentNebenkosten();
    saveAllData();
}

function removeEntry(element, jobType, type) {
    element.remove();
    if (type === 'arbeitszeit') {
        if (jobType === 'hauptjob') updateCurrentHauptjobGehalt();
        else updateCurrentNebenjobGehalt();
    } else if (type === 'kosten') {
        updateCurrentKosten();
    } else if (type === 'nebenkosten') {
        updateCurrentNebenkosten();
    }
    saveAllData();
}

function updateCurrentHauptjobGehalt() {
    const stundenlohnInput = document.getElementById('hauptjobStundenlohn');
    const stundenlohn = parseFloat(stundenlohnInput.value);
    let gesamtStunden = 0;
    const arbeitszeitEintraege = document.querySelectorAll('#hauptjobArbeitszeiten .entry-row');
    arbeitszeitEintraege.forEach(entry => {
        const stundenInput = entry.querySelector('input[type="number"]');
        const stunden = parseFloat(stundenInput.value);
        if (!isNaN(stunden) && stunden >= 0) {
            gesamtStunden += stunden;
        }
    });
    const currentGehalt = isNaN(stundenlohn) || stundenlohn < 0 ? 0 : (gesamtStunden * stundenlohn);
    document.querySelector('#currentHauptjobGehalt span').innerText = `${currentGehalt.toFixed(2)} €`;
}

function updateCurrentNebenjobGehalt() {
    const stundenlohnInput = document.getElementById('nebenjobStundenlohn');
    const stundenlohn = parseFloat(stundenlohnInput.value);
    let gesamtStunden = 0;
    const arbeitszeitEintraege = document.querySelectorAll('#nebenjobArbeitszeiten .entry-row');
    arbeitszeitEintraege.forEach(entry => {
        const stundenInput = entry.querySelector('input[type="number"]');
        const stunden = parseFloat(stundenInput.value);
        if (!isNaN(stunden) && stunden >= 0) {
            gesamtStunden += stunden;
        }
    });
    const currentGehalt = isNaN(stundenlohn) || stundenlohn < 0 ? 0 : (gesamtStunden * stundenlohn);
    document.querySelector('#currentNebenjobGehalt span').innerText = `${currentGehalt.toFixed(2)} €`;
}

function updateCurrentKosten() {
    let gesamtKosten = 0;
    const kostenEintraege = document.querySelectorAll('#kosten .entry-row');
    kostenEintraege.forEach(entry => {
        const kostenInput = entry.querySelector('input[type="number"]');
        const kosten = parseFloat(kostenInput.value);
        if (!isNaN(kosten) && kosten >= 0) {
            gesamtKosten += kosten;
        }
    });
    document.querySelector('#currentKosten span').innerText = `${gesamtKosten.toFixed(2)} €`;
}

function updateCurrentNebenkosten() {
    let gesamtNebenkosten = 0;
    const nebenkostenEintraege = document.querySelectorAll('#nebenkosten .entry-row');
    nebenkostenEintraege.forEach(entry => {
        const nebenkostenInput = entry.querySelector('input[type="number"]');
        const nebenkosten = parseFloat(nebenkostenInput.value);
        if (!isNaN(nebenkosten) && nebenkosten >= 0) {
            gesamtNebenkosten += nebenkosten;
        }
    });
    document.querySelector('#currentNebenkosten span').innerText = `${gesamtNebenkosten.toFixed(2)} €`;
}

function saveAllData() {
    const monthYear = getCurrentMonthYear();

    const hauptjobData = {
        stundenlohn: document.getElementById('hauptjobStundenlohn').value,
        steuerklasse: document.getElementById('steuerklasse').value,
        arbeitszeiten: []
    };
    document.querySelectorAll('#hauptjobArbeitszeiten .entry-row').forEach(entry => {
        hauptjobData.arbeitszeiten.push({
            date: entry.querySelector('input[type="date"]').value,
            hours: entry.querySelector('input[type="number"]').value
        });
    });
    localStorage.setItem(`hauptjob-data-${monthYear}`, JSON.stringify(hauptjobData));
    localStorage.setItem(`hauptjob-stundenlohn-last`, document.getElementById('hauptjobStundenlohn').value);
    localStorage.setItem(`steuerklasse-last`, document.getElementById('steuerklasse').value);

    const nebenjobData = {
        stundenlohn: document.getElementById('nebenjobStundenlohn').value,
        arbeitszeiten: []
    };
    document.querySelectorAll('#nebenjobArbeitszeiten .entry-row').forEach(entry => {
        nebenjobData.arbeitszeiten.push({
            date: entry.querySelector('input[type="date"]').value,
            hours: entry.querySelector('input[type="number"]').value
        });
    });
    localStorage.setItem(`nebenjob-data-${monthYear}`, JSON.stringify(nebenjobData));
    localStorage.setItem(`nebenjob-stundenlohn-last`, document.getElementById('nebenjobStundenlohn').value);

    const kostenData = { kosten: [] };
    document.querySelectorAll('#kosten .entry-row').forEach(entry => {
        kostenData.kosten.push({
            name: entry.querySelector('input[type="text"]').value,
            amount: entry.querySelector('input[type="number"]').value
        });
    });
    localStorage.setItem(`kosten-permanent`, JSON.stringify(kostenData));

    const nebenkostenData = { nebenkosten: [] };
    document.querySelectorAll('#nebenkosten .entry-row').forEach(entry => {
        nebenkostenData.nebenkosten.push({
            name: entry.querySelector('input[type="text"]').value,
            amount: entry.querySelector('input[type="number"]').value
        });
    });
    localStorage.setItem(`nebenkosten-${monthYear}`, JSON.stringify(nebenkostenData));
}

function loadAllData() {
    const monthYear = getCurrentMonthYear();

    const savedHauptjobData = localStorage.getItem(`hauptjob-data-${monthYear}`);
    if (savedHauptjobData) {
        const data = JSON.parse(savedHauptjobData);
        document.getElementById('hauptjobStundenlohn').value = data.stundenlohn || defaultStundenlohnHauptjob;
        document.getElementById('steuerklasse').value = data.steuerklasse || '1';
        document.getElementById('hauptjobArbeitszeiten').innerHTML = '';
        if (data.arbeitszeiten && data.arbeitszeiten.length > 0) {
            data.arbeitszeiten.forEach(item => addArbeitszeitFeld('hauptjob', item.date, item.hours));
        } else {
            addArbeitszeitFeld('hauptjob', new Date().toISOString().slice(0, 10), 8);
            addArbeitszeitFeld('hauptjob', '', 0);
        }
    } else {
        document.getElementById('hauptjobStundenlohn').value = localStorage.getItem(`hauptjob-stundenlohn-last`) || defaultStundenlohnHauptjob;
        document.getElementById('steuerklasse').value = localStorage.getItem(`steuerklasse-last`) || '1';
        document.getElementById('hauptjobArbeitszeiten').innerHTML = '';
        addArbeitszeitFeld('hauptjob', new Date().toISOString().slice(0, 10), 8);
        addArbeitszeitFeld('hauptjob', '', 0);
    }

    const savedNebenjobData = localStorage.getItem(`nebenjob-data-${monthYear}`);
    if (savedNebenjobData) {
        const data = JSON.parse(savedNebenjobData);
        document.getElementById('nebenjobStundenlohn').value = data.stundenlohn || defaultStundenlohnNebenjob;
        document.getElementById('nebenjobArbeitszeiten').innerHTML = '';
        if (data.arbeitszeiten && data.arbeitszeiten.length > 0) {
            data.arbeitszeiten.forEach(item => addArbeitszeitFeld('nebenjob', item.date, item.hours));
        } else {
            addArbeitszeitFeld('nebenjob', '', 0);
        }
    } else {
        document.getElementById('nebenjobStundenlohn').value = localStorage.getItem(`nebenjob-stundenlohn-last`) || defaultStundenlohnNebenjob;
        document.getElementById('nebenjobArbeitszeiten').innerHTML = '';
        addArbeitszeitFeld('nebenjob', '', 0);
    }

    const savedKostenData = localStorage.getItem(`kosten-permanent`);
    document.getElementById('kosten').innerHTML = '';
    if (savedKostenData) {
        const data = JSON.parse(savedKostenData);
        if (data.kosten && data.kosten.length > 0) {
            data.kosten.forEach(item => addKostenFeld(item.name, item.amount));
        } else {
            addKostenFeld('Miete', 500);
            addKostenFeld('Strom', 50);
            addKostenFeld('Internet', 35);
            addKostenFeld('', 0);
        }
    } else {
        addKostenFeld('Miete', 500);
        addKostenFeld('Strom', 50);
        addKostenFeld('Internet', 35);
        addKostenFeld('', 0);
    }

    const savedNebenkostenData = localStorage.getItem(`nebenkosten-${monthYear}`);
    document.getElementById('nebenkosten').innerHTML = '';
    if (savedNebenkostenData) {
        const data = JSON.parse(savedNebenkostenData);
        if (data.nebenkosten && data.nebenkosten.length > 0) {
            data.nebenkosten.forEach(item => addNebenkostenFeld(item.name, item.amount));
        } else {
            addNebenkostenFeld('Hobby', 20);
            addNebenkostenFeld('Transport', 30);
            addNebenkostenFeld('', 0);
        }
    } else {
        addNebenkostenFeld('Hobby', 20);
        addNebenkostenFeld('Transport', 30);
        addNebenkostenFeld('', 0);
    }

    updateCurrentHauptjobGehalt();
    updateCurrentNebenjobGehalt();
    updateCurrentKosten();
    updateCurrentNebenkosten();
}

function toggleCollapsible(header) {
    const contentId = header.dataset.target;
    const content = document.getElementById(contentId);
    const icon = header.querySelector('.collapse-icon');

    if (content.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
        setTimeout(() => {
            content.style.maxHeight = "0";
            content.classList.remove('active');
            header.classList.add('collapsed');
        }, 10);
    } else {
        content.classList.add('active');
        header.classList.remove('collapsed');
        content.style.maxHeight = content.scrollHeight + "px";
        content.addEventListener('transitionend', function handler() {
            if (content.classList.contains('active')) {
                content.style.maxHeight = '1000px';
            }
            content.removeEventListener('transitionend', handler);
        });
    }
}

let lastActiveViewButton = null;

function showView(viewId) {
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        setTimeout(() => {
            targetView.classList.add('active');
        }, 50);
    }

    document.querySelectorAll('.main-navigation button').forEach(button => {
        button.classList.remove('active');
    });
    const currentActiveButton = document.getElementById(`show${viewId.replace('Ansicht', 'Btn')}`);
    if (currentActiveButton) {
        currentActiveButton.classList.add('active');
        lastActiveViewButton = currentActiveButton;
    }

    if (viewId === 'ergebnisAnsicht') {
        berechneErgebnis();
    }
}

function calculateEstimatedTaxes(bruttoGehalt, steuerklasse) {
    let taxRate = 0;

    switch (parseInt(steuerklasse)) {
        case 1: taxRate = 0.35; break;
        case 2: taxRate = 0.30; break;
        case 3: taxRate = 0.20; break;
        case 4: taxRate = 0.32; break;
        case 5: taxRate = 0.45; break;
        case 6: taxRate = 0.50; break;
        default: taxRate = 0.35;
    }

    const minijobLimit = 538;
    if (bruttoGehalt <= minijobLimit && (steuerklasse == 1 || steuerklasse == 2)) {
            return 0;
    }

    return bruttoGehalt * taxRate;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('hauptjobStundenlohn').addEventListener('input', saveAllData);
    document.getElementById('hauptjobStundenlohn').addEventListener('input', updateCurrentHauptjobGehalt);
    document.getElementById('steuerklasse').addEventListener('change', saveAllData);

    document.getElementById('nebenjobStundenlohn').addEventListener('input', saveAllData);
    document.getElementById('nebenjobStundenlohn').addEventListener('input', updateCurrentNebenjobGehalt);

    document.getElementById('addHauptjobArbeitszeitBtn').addEventListener('click', () => addArbeitszeitFeld('hauptjob', '', 0));
    document.getElementById('addNebenjobArbeitszeitBtn').addEventListener('click', () => addArbeitszeitFeld('nebenjob', '', 0));

    document.getElementById('addKostenBtn').addEventListener('click', () => addKostenFeld('', 0));
    document.getElementById('addNebenkostenBtn').addEventListener('click', () => addNebenkostenFeld('', 0));

    document.getElementById('backButton').addEventListener('click', () => showView('arbeitszeitAnsicht'));

    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => toggleCollapsible(header));
    });

    document.getElementById('showArbeitszeitBtn').addEventListener('click', () => showView('arbeitszeitAnsicht'));
    document.getElementById('showKostenBtn').addEventListener('click', () => showView('kostenAnsicht'));
    document.getElementById('showErgebnisBtn').addEventListener('click', () => showView('ergebnisAnsicht'));

    loadAllData();
    showView('arbeitszeitAnsicht');
});

function berechneErgebnis() {
    const hauptjobStundenlohn = parseFloat(document.getElementById('hauptjobStundenlohn').value);
    const steuerklasse = document.getElementById('steuerklasse').value;
    let gesamtStundenHauptjob = 0;
    document.querySelectorAll('#hauptjobArbeitszeiten .entry-row').forEach(entry => {
        const stundenInput = entry.querySelector('input[type="number"]');
        const stunden = parseFloat(stundenInput.value);
        if (!isNaN(stunden) && stunden >= 0) {
            gesamtStundenHauptjob += stunden;
        }
    });

    const nebenjobStundenlohn = parseFloat(document.getElementById('nebenjobStundenlohn').value);
    let gesamtStundenNebenjob = 0;
    document.querySelectorAll('#nebenjobArbeitszeiten .entry-row').forEach(entry => {
        const stundenInput = entry.querySelector('input[type="number"]');
        const stunden = parseFloat(stundenInput.value);
        if (!isNaN(stunden) && stunden >= 0) {
            gesamtStundenNebenjob += stunden;
        }
    });

    let gesamtKosten = 0;
    document.querySelectorAll('#kosten .entry-row').forEach(entry => {
        const kostenInput = entry.querySelector('input[type="number"]');
        const kosten = parseFloat(kostenInput.value);
        if (!isNaN(kosten) && kosten >= 0) {
            gesamtKosten += kosten;
        }
    });

    let gesamtNebenkosten = 0;
    document.querySelectorAll('#nebenkosten .entry-row').forEach(entry => {
        const nebenkostenInput = entry.querySelector('input[type="number"]');
        const nebenkosten = parseFloat(nebenkostenInput.value);
        if (!isNaN(nebenkosten) && nebenkosten >= 0) {
            gesamtNebenkosten += nebenkosten;
        }
    });

    if (isNaN(hauptjobStundenlohn) || hauptjobStundenlohn < 0) {
        document.getElementById('ergebnis').innerText = "Bitte einen gültigen positiven Stundenlohn für den Hauptjob eingeben.";
        document.getElementById('ergebnis').style.borderColor = '#d9534f';
        document.getElementById('ergebnis').style.color = '#d9534f';
        document.getElementById('ergebnis').style.backgroundColor = '#402020';
        return;
    }
    if (isNaN(nebenjobStundenlohn) || nebenjobStundenlohn < 0) {
        if (nebenjobStundenlohn !== 0 && (isNaN(nebenjobStundenlohn) || nebenjobStundenlohn < 0)) {
            document.getElementById('ergebnis').innerText = "Bitte einen gültigen positiven Stundenlohn für den Nebenjob eingeben.";
            document.getElementById('ergebnis').style.borderColor = '#d9534f';
            document.getElementById('ergebnis').style.color = '#d9534f';
            document.getElementById('ergebnis').style.backgroundColor = '#402020';
            return;
        }
    }

    const bruttoGehaltHauptjob = gesamtStundenHauptjob * hauptjobStundenlohn;
    const bruttoGehaltNebenjob = gesamtStundenNebenjob * nebenjobStundenlohn;
    const gesamtBruttoGehalt = bruttoGehaltHauptjob + bruttoGehaltNebenjob;

    const geschaetzteSteuern = calculateEstimatedTaxes(gesamtBruttoGehalt, steuerklasse);

    const nettoGehalt = gesamtBruttoGehalt - geschaetzteSteuern;
    const gesamtAusgaben = gesamtKosten + gesamtNebenkosten;
    const restbetrag = nettoGehalt - gesamtAusgaben;

    document.getElementById('ergebnis').style.borderColor = '';
    document.getElementById('ergebnis').style.color = '';
    document.getElementById('ergebnis').style.backgroundColor = '';

    document.getElementById('ergebnis').innerHTML = `
        <p>Deine Steuerklasse (für Hauptjob-Berechnung): <strong>${steuerklasse}</strong></p><br>

        <h3>Einkommen:</h3>
        <p>Geschätzter Brutto-Verdienst Hauptjob: <strong>${bruttoGehaltHauptjob.toFixed(2)} Euro</strong></p>
        <p>Geschätzter Brutto-Verdienst Nebenjob: <strong>${bruttoGehaltNebenjob.toFixed(2)} Euro</strong></p>
        <p>Gesamter Brutto-Verdienst: <strong>${gesamtBruttoGehalt.toFixed(2)} Euro</strong></p>
        <p>Geschätzte Abzüge (Steuern & SV): <strong>${geschaetzteSteuern.toFixed(2)} Euro</strong></p>
        <p>Geschätzter Netto-Verdienst: <strong>${nettoGehalt.toFixed(2)} Euro</strong></p><br>

        <h3>Ausgaben:</h3>
        <p>Monatliche Fixkosten: <strong>${gesamtKosten.toFixed(2)} Euro</strong></p>
        <p>Variable Nebenkosten: <strong>${gesamtNebenkosten.toFixed(2)} Euro</strong></p>
        <p>Gesamte Ausgaben: <strong>${gesamtAusgaben.toFixed(2)} Euro</strong></p><br>

        <p>Dir bleiben nach Abzug aller Kosten und Steuern: <strong style="color: ${restbetrag >= 0 ? '#5cb85c' : '#d9534f'};">${restbetrag.toFixed(2)} Euro</strong></p>
        <p style="font-size: 0.85em; color: #aaa; margin-top: 15px;">
            Hinweis: Die Steuerberechnung ist eine grobe Schätzung und ersetzt keine professionelle Steuerberatung.
        </p>
    `;
}