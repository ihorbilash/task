


document.addEventListener('DOMContentLoaded', function () {
    getNames();
    displayLogin();
})

function getNames() {
    fetch('http://localhost:3005/api/items')
        .then(res => res.json())
        .then(res => {
            if (res.error === "forbidden") {
                loginInfo = false;
            }
            const table = document.querySelector('tbody');
            table.innerHTML = "<tr></tr>"
            if (localStorage.length !== 0) {
                loadHTMLTable(res)
            }
        })
    displayLogin()
}

function loadHTMLTable(res) {
    const table = document.querySelector('tbody');
    if (res['items'].length === 0) {
        table.innerHTML = "<tr><td style='text-align: center;' class='no-data' colspan='4'>No Data</td></tr>";
        return;
    }
    table.innerHTML = insertDataInTable(res);
}


function insertDataInTable(data) {
    let tableHTML = '';
    data['items'].forEach(({ n_id, name, rang }) => {

        const textTable = `<td draggable="true" ondragstart="onDragStart(event);" 
        ondragover="onDragOver(event);" ondrop="onDrop(event);"
         id="${rang}">${name}</td>`;
        tableHTML += "<tr>"
        tableHTML += `<td>${rang}</td>`
        tableHTML += textTable
        tableHTML += `<td><button onclick="editName(${n_id},${rang})" >  Edit  </td>`
        tableHTML += `<td><button onclick="deleteName(${n_id})" >Delete</td>`
        tableHTML += "</tr>";
    });
    return tableHTML;
}
function editName(id, rang) {
    var itemText = document.getElementById(`${rang}`);
    const text = itemText.innerText
    const input = document.createElement('input');
    input.value = text;
    itemText.append(input);

    input.addEventListener('blur', function () {
        editItem(rang, id, input.value);
    });
}

function editItem(rang, id, name) {
    let checkBox = document.getElementById(`${rang}`);
    checkBox = checkBox.checked;
    let checkName = name ? name : document.getElementById(`${rang}`).innerText;

    let request = JSON.stringify({ name: checkName, id: id, });

    fetch('http://localhost:3005/api/items', {
        method: 'PATCH',
        body: request,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json())
        .then(res => {
            if (res.ok)
                getNames();
        });

}

//------
function onDragStart(event) {
    event
        .dataTransfer
        .setData('text/plain', event.target.id);
}
function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    const get_id = id;
    const put_id = event.target.id;
    editRang(get_id, put_id)
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();
}
//------
function editRang(get_id, put_id) {


    let request = JSON.stringify({ get_r: get_id, put_r: put_id });

    fetch('http://localhost:3005/api/items', {
        method: 'PUT',
        body: request,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .then(res => {
            if (res.ok)
                getNames();
        });

}
function addName() {
    const dataInput = document.querySelector('.input-data');
    let data = dataInput.value;
    data = data.replace(/\s/g, '')
    dataInput.value = "";
    if (data.length > 2)
        fetch('http://localhost:3005/api/items', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ name: data })
        })
            .then(response => response.json())
            .then(res => {
                if (res.id) {
                    getNames();
                }
            });
}
function deleteName(id) {

    fetch('http://localhost:3005/api/items', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({ id: id })
    })
        .then(response => response.json())
        .then(res => {
            if (res.ok) {
                getNames();
            }
        });
}

function register() {
    const route = 'http://localhost:3005/api/register';
    const login = document.getElementById("login-input").value.trim();
    const pass = document.getElementById("pass-input").value.trim();
    fetch(route, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, pass })
    })
        .then(res => res.json())
        .then(res => {
            if (res.ok) {
                alert('you are registered');
            } else if (res.error === 'bad request') {
                alert('this combination already exists');
            }
        })
}
function login() {
    const route = 'http://localhost:3005/api/login';
    const login = document.getElementById("login-input").value.trim();
    const pass = document.getElementById("pass-input").value.trim();
    fetch(route, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, pass })
    })
        .then(res => res.json())
        .then(res => {
            if (res.ok) {
                localStorage.setItem('name', login)
                displayLogin();
                getNames();

            } else if (res.error === 'not found') {
                alert('this combination of login and password was not found');
            }
        })
}
function logout() {
    const route = 'http://localhost:3005/api/logout';
    fetch(route, {
        method: 'POST',
        credentials: 'include',
    })
        .then(res => res.json())
        .then(res => {
            if (res.ok) {

                localStorage.clear();
                loginInfo = false;
                displayLogin();
                getNames();
            }
        })
}

function displayLogin() {
    let elLogin = document.querySelector(".autorization-form");
    let elTable = document.querySelector(".add-data-user");

    if (localStorage.length !== 0) {
        elLogin.style.display = "none"
        elTable.style.display = "block"
        document.getElementById("name").textContent = "User: " + localStorage.getItem('name')
    } else {
        elLogin.style.display = "block"
        elTable.style.display = "none"

    }

}

