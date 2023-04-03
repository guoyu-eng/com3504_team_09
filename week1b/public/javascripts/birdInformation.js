fetch('../../controller/bird')
    .then(response => response.json())
    .then(birds => {
        const table = document.getElementById('bird-table');
        const tbody = table.querySelector('tbody');

        birds.forEach(bird => {
            const row = tbody.insertRow();
            const nameCell = row.insertCell();
            // const colorCell = row.insertCell();
            // const sizeCell = row.insertCell();
            nameCell.innerText = bird.name;
            // colorCell.innerText = bird.color;
            // sizeCell.innerText = bird.size;
        });
    });
