document.addEventListener('DOMContentLoaded', function() {
    let currentRow;
    
    const selfTestLinks = document.querySelectorAll('.self-test-link');
    const saveChangesButton = document.getElementById('saveChangesButton');
    const selectSelfTest = document.getElementById('selectSelfTest');
    const selectMaterial = document.getElementById('selectMaterial');
    const saveOperationChangesButton = document.getElementById('saveOperationChangesButton');
    
    selfTestLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            currentRow = link.closest('tr');
        });
    });
    
    saveChangesButton.addEventListener('click', function() {
        const selectedSelfTest = Array.from(selectSelfTest.selectedOptions).map(option => option.text).join(', ');
        const selectedMaterial = selectMaterial.value;
        
        // Update the operation cell in the current row
        const operationCell = currentRow.querySelector('td:last-child');
        operationCell.innerHTML = `
            <span class="operation-link" data-toggle="modal" data-target="#operationModal">${selectedSelfTest} - ${selectedMaterial}</span>
        `;
        
        // Add a new column header for the selected self-test and material if not already present
        const table = document.getElementById('mainTable');
        const headerRow = table.querySelector('thead tr');
        const headerExists = Array.from(headerRow.cells).some(cell => cell.innerText === `${selectedSelfTest} - ${selectedMaterial}`);
        
        if (!headerExists) {
            const newHeader = document.createElement('th');
            newHeader.innerText = `${selectedSelfTest} - ${selectedMaterial}`;
            headerRow.appendChild(newHeader);
            
            // Add cells with input fields to the existing rows for the new column
            table.querySelectorAll('tbody tr').forEach(row => {
                const newCell = document.createElement('td');
                if (row === currentRow) {
                    newCell.innerHTML = '<input type="text" class="form-control">';
                }
                row.appendChild(newCell);
            });
        } else {
            // Add input field to the current row in the correct column
            const columnIndex = Array.from(headerRow.cells).findIndex(cell => cell.innerText === `${selectedSelfTest} - ${selectedMaterial}`);
            const newCell = currentRow.cells[columnIndex];
            newCell.innerHTML = '<input type="text" class="form-control">';
        }
        
        // Close the modal
        $('#selfTestModal').modal('hide');
    });
    
    // Open the new modal when clicking on the names in the operation column
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('operation-link')) {
            currentRow = event.target.closest('tr');
            $('#operationModal').modal('show');
        }
    });

    saveOperationChangesButton.addEventListener('click', function() {
        // Add logic here to handle saving changes from the new modal if needed

        // Close the new modal
        $('#operationModal').modal('hide');
    });
});
