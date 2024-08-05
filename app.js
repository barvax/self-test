let parameterCount = 1;

document.getElementById('addButton').addEventListener('click', addCard);

function addCard() {
    parameterCount++;
    const parameterTitle = `${parameterCount}th Parameter`;
    
    // Create a new card
    const newCard = document.createElement('div');
    newCard.className = 'col-md-6';
    newCard.innerHTML = `
        <div class="form-container card p-3 mb-4">
            <h4>${parameterTitle}</h4>
            <form>
                <div class="form-group">
                    <label for="testName">Test Name</label>
                    <input type="text" id="testName" name="testName" class="form-control">
                </div>
                <div class="form-group">
                    <label for="selfTestType">Self Test Type</label>
                    <select id="selfTestType" name="selfTestType" class="form-control">
                        <option value="Formulation">Formulation</option>
                        <!-- Add more options as needed -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="defaultFieldType">Default Field Type</label>
                    <select id="defaultFieldType" name="defaultFieldType" class="form-control" onchange="handleFieldTypeChange(this)">
                        <option value="Numeric">Numeric</option>
                        <option value="Text">Text</option>
                        <option value="Dropdown">Dropdown</option>
                        <!-- Add more options as needed -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="uomType">UOM Type</label>
                    <select id="uomType" name="uomType" class="form-control">
                        <option value="Percent">Percent</option>
                        <option value="Weight">Weight</option>
                        <!-- Add more options as needed -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="defaultUom">Default UOM</label>
                    <select id="defaultUom" name="defaultUom" class="form-control">
                        <option value="%">%</option>
                        <option value="gr">gr</option>
                        <option value="Kg">Kg</option>
                        <!-- Add more options as needed -->
                    </select>
                </div>
                <div class="form-buttons">
                    <button type="button" class="btn btn-primary" onclick="addCard()">+</button>
                    <button type="submit" class="btn btn-success">Save</button>
                    <button type="button" class="btn btn-danger">Cancel</button>
                </div>
            </form>
            <div class="dropdown-table-container" style="display: none; margin-top: 20px;">
                <div class="form-buttons" style="margin-top: 20px;">
                    <button type="button" class="btn btn-secondary btn-add-row" onclick="addRow(this)">Add</button>
                    <button type="button" class="btn btn-secondary btn-remove-row" onclick="removeRow(this)">Remove</button>
                </div>
                <table class="table table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Append the new card to the form container
    document.getElementById('formContainer').appendChild(newCard);
}

function handleFieldTypeChange(selectElement) {
    const card = selectElement.closest('.card');
    const dropdownTableContainer = card.querySelector('.dropdown-table-container');
    
    if (selectElement.value === 'Dropdown') {
        dropdownTableContainer.style.display = 'block';
    } else {
        dropdownTableContainer.style.display = 'none';
    }
}

function addRow(button) {
    const card = button.closest('.card');
    const tableBody = card.querySelector('table tbody');
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="form-control"></td>
    `;
    tableBody.appendChild(newRow);
}

function removeRow(button) {
    const card = button.closest('.card');
    const tableBody = card.querySelector('table tbody');
    
    if (tableBody.rows.length > 1) {
        tableBody.deleteRow(-1);
    }
}
