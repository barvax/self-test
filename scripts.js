document.addEventListener('DOMContentLoaded', function() {
    const saveChangesButton = document.getElementById('saveChangesButton');
    const resultTypeInput = document.getElementById('resultType');
    const selfTestTypeSelect = document.getElementById('selfTestType');
    const selfTestsTableBody = document.querySelector('#selfTestsTable tbody');
    const selectSelfTestDropdown = document.getElementById('selectSelfTest');
    const saveSelfTestChangesButton = document.getElementById('saveSelfTestChangesButton');
    const mainTable = document.getElementById('mainTable');

    // Load selfTests from localStorage
    let selfTests = JSON.parse(localStorage.getItem('selfTests')) || [];

    let currentRow; // Variable to store the current row reference

    function updateSelfTestsTable() {
        if (!selfTestsTableBody) return; // Return if the table body element is not found
        selfTestsTableBody.innerHTML = '';

        selfTests.forEach(test => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${test.name}</td>
                <td>${test.type}</td>
                <td>${test.active}</td>
            `;
            selfTestsTableBody.appendChild(row);
        });
    }

    function updateSelfTestDropdown() {
        if (!selectSelfTestDropdown) return;
        selectSelfTestDropdown.innerHTML = '';
        selfTests.filter(test => test.type === 'Formulation').forEach(test => {
            const option = document.createElement('option');
            option.value = test.name;
            option.text = test.name;
            selectSelfTestDropdown.appendChild(option);
        });
    }

    if (saveChangesButton) {
        saveChangesButton.addEventListener('click', function() {
            const newSelfTest = {
                name: resultTypeInput.value,
                type: selfTestTypeSelect.value,
                active: 'Yes'
            };

            selfTests.push(newSelfTest);
            localStorage.setItem('selfTests', JSON.stringify(selfTests));
            updateSelfTestsTable();
            updateSelfTestDropdown();
            $('#newModal').modal('hide');
            document.getElementById('newEntryForm').reset();
        });
    }

    if (saveSelfTestChangesButton) {
        saveSelfTestChangesButton.addEventListener('click', function() {
            const selectedSelfTests = Array.from(selectSelfTestDropdown.selectedOptions).map(option => option.value);
            const selectedMaterial = document.getElementById('selectMaterial').value;

            // Get table header and add new columns if needed
            const tableHeaderRow = document.querySelector('#mainTable thead tr');
            const tableRows = document.querySelectorAll('#mainTable tbody tr');

            selectedSelfTests.forEach(selfTest => {
                // Check if the self-test column already exists
                let existingHeader = Array.from(tableHeaderRow.children).find(th => th.textContent.includes(selfTest) && th.textContent.includes(selectedMaterial));
                if (!existingHeader) {
                    // Add self-test column
                    const selfTestColumnHeader = document.createElement('th');
                    selfTestColumnHeader.textContent = `${selfTest} (${selectedMaterial})`;
                    tableHeaderRow.insertBefore(selfTestColumnHeader, tableHeaderRow.querySelector('.operation-column'));

                    // Add columns to each row
                    tableRows.forEach(row => {
                        const selfTestCell = document.createElement('td');
                        row.insertBefore(selfTestCell, row.querySelector('.operation-cell'));
                    });
                }
            });

            $('#selfTestModal').modal('hide');

            // Add "+" and copy image buttons to every cell in the "Self-Test" column
            tableRows.forEach(row => {
                const selfTestCell = row.querySelector('td:nth-child(5)');
                if (selfTestCell) {
                    if (!selfTestCell.innerHTML.includes('copy-regular.svg')) {
                        selfTestCell.innerHTML = '<button class="btn btn-link p-0 self-test-btn" data-sample="true">+</button> <button class="btn btn-link p-0 self-test-star-btn"><img src="images/copy-regular.svg" alt="Copy"></button>';
                    }
                }
            });

            // Add "Formulation" hyperlink and input fields to the operation cell of the current row
            if (currentRow) {
                const operationCell = currentRow.querySelector('.operation-cell');
                if (operationCell) {
                    operationCell.innerHTML = `<a href="#">Formulation</a>`;
                }

                selectedSelfTests.forEach(selfTest => {
                    let selfTestColumnIndex = Array.from(tableHeaderRow.children).findIndex(th => th.textContent.includes(selfTest) && th.textContent.includes(selectedMaterial));
                    const selfTestCell = currentRow.children[selfTestColumnIndex];
                    if (selfTestCell) {
                        selfTestCell.innerHTML = '<input type="text" class="form-control">';
                    }
                });

                currentRow = null; // Reset current row after update
            }

            // Reassign event listeners to the copy image buttons
            document.querySelectorAll('.self-test-star-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const hasSample = row.querySelector('td:nth-child(4)').textContent.trim() !== ''; // Check if there is a sample in the row
                    if (hasSample) {
                        const selfTestCells = row.querySelectorAll('td:nth-child(5) ~ td:not(.operation-cell)');
                        selfTestCells.forEach(cell => {
                            if (!cell.querySelector('input')) {
                                cell.innerHTML = '<input type="text" class="form-control">';
                            }
                        });

                        // Add "Formulation" hyperlink to the operation cell
                        const operationCell = row.querySelector('.operation-cell');
                        if (operationCell) {
                            operationCell.innerHTML = `<a href="#">Formulation</a>`;
                        }
                    }
                });
            });

            // Reassign event listeners to the "+" buttons
            document.querySelectorAll('.self-test-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const hasSample = row.querySelector('td:nth-child(4)').textContent.trim() !== ''; // Check if there is a sample in the row
                    currentRow = row; // Set current row reference
                    if (!hasSample) {
                        $('#sampleModal').modal('show');
                    } else {
                        updateSelfTestDropdown();
                        $('#selfTestModal').modal('show');
                    }
                });
            });
        });
    }

    // Handle initial "+" button click for rows without a sample
    document.querySelectorAll('.self-test-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const hasSample = row.querySelector('td:nth-child(4)').textContent.trim() !== ''; // Check if there is a sample in the row
            currentRow = row; // Set current row reference
            if (!hasSample) {
                $('#sampleModal').modal('show');
            } else {
                updateSelfTestDropdown();
                $('#selfTestModal').modal('show');
            }
        });
    });

    // Initial table update
    updateSelfTestsTable();
});
