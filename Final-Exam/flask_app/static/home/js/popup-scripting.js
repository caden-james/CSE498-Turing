

const boardTitleInput = document.getElementById('board-title');
const createButton = document.getElementById('create-button');

boardTitleInput.addEventListener('input', () => {
    if (boardTitleInput.value.trim() === '') {
        createButton.disabled = true;
        createButton.classList.add('disabled');
        createButton.classList.remove('enabled');
    } else {
        createButton.disabled = false;
        createButton.classList.remove('disabled');
        createButton.classList.add('enabled');
    }
});


const createbutton = document.getElementById("createButton");
createbutton.addEventListener(
    'click',
    function() {
        const popup = document.getElementById('popup');
        popup.style.display = 'block';
    }
)

const closebutton = document.getElementById("close-button");
closebutton.addEventListener('click', closePopup);
    
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    document.getElementById('board-title').value = '';
    const Dropdown = document.getElementById('user');
    Dropdown.selectedIndex = -1;
    createButton.classList.add('disabled');
    createButton.classList.remove('enabled');


}

const submitButton = document.getElementById("create-button");
submitButton.addEventListener(
    'click',
    function() {
        title = getBoardTitle()
        access = getSelectedUsers();

        if (access.length != 0) {
            var i = 0;
            for (user in access) { 
                // console.log(access[i]);
                if (access[i] == "ALLUSERS") { 
                    // console.log('all users');
                    access = getAllUsers();
                } 
                i++;
            }
        } 

        createBoard(boardName = title, memberEmails = access);
        closePopup();

        
    }
)

// Get the selected values from the dropdown
function getSelectedUsers() {
    const visibilityDropdown = document.getElementById('user');
    const selectedOptions = Array.from(visibilityDropdown.selectedOptions).map(option => option.value);
    return selectedOptions;
}

// Get the board title from the input field
function getBoardTitle() {
    const boardTitle = document.getElementById('board-title').value.trim();
    return boardTitle;
}



function createBoard(boardName, memberEmails) {
    
        console.log("Project Name:", boardName);
        
        // Create the JSON object to send to backend
        var formData = {'project_name': boardName, 'members': memberEmails};
        console.log("FORMDATA,", JSON.stringify(formData));

        // Create the members list properly to send it to the backend
        memberEmails.forEach((email, index) => {
            formData[`members[${index}]`] = email;
        });

        console.log("Member Emails:", memberEmails);

        jQuery.ajax({
            url: "/createboard",
            data: formData,
            traditional: true,
            type: "POST",
            success: function(returned_data) {
                console.log("Server Response:", returned_data);

                if (returned_data['success']) {
                    window.location.href = '/openboard';
                } 
            },
            error: function(xhr, status, error) {
                console.error("Error Occurred:", status, error);
            }
        })
    
}

function getAllUsers() {
    var allUsers = [];
    var i = 0;
    var user = document.getElementById('user');
    for (i = 0; i < user.length; i++) {
        allUsers.push(user.options[i].value);
    }
    allUsers.shift();
    return allUsers;
}