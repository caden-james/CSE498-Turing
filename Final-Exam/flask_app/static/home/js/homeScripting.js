// const projectEntries = document.querySelectorAll(".project-entry");
// const projViewer = document.getElementById("project-viewer");
// const projSkills = document.getElementById("project-skills-holder");
// const skillsList = projSkills.querySelector("#project-holder");

// projectEntries.forEach((proj) => {
//     proj.addEventListener("mouseover", function () {
//         //img
//         projViewer.style.opacity = "1";
//         projViewer.style.backgroundImage = "url(" + proj.dataset.projectImg + ")";

//         //skills
//         // Show skills
//         // const skills = JSON.parse(proj.dataset.projectSkills); // Parse the JSON string back to an array
//         // skillsList.innerHTML = ""; // Clear previous skills

//         // skills.forEach(skill => {
//         //     const skillItem = document.createElement("li");
//         //     skillItem.className = "project";
//         //     skillItem.textContent = skill;
//         //     skillsList.appendChild(skillItem); // Add each skill to the list
//         // });
//         // projSkills.style.opacity = "1";

//     });

//     proj.addEventListener("mouseleave", function () {
//         projViewer.style.opacity = ".2";
//         // projViewer.style.backgroundImage = "url('../images/image.png')";
//         projViewer.style.backgroundImage = "none";
//         projSkills.style.opacity = "0";
//     });
// });





// Existing board stuff
// Get all board links
const boards = document.querySelectorAll('.trello-card.existing');
if (boards) {
    
    // Attach event listeners to each board link
    boards.forEach(link => {
        link.addEventListener(
            'click',
            function(event) {
                console.log('clicked',this, this.id);
                event.preventDefault();

                // Get the board id and name associated with this specific link
                const boardID = this.id;

                var formData = {'board_id': boardID};

                // Call the getboardid endpoint to store the clicked on project's id in session
                jQuery.ajax({
                    url: "/selectexistingboard",
                    data: formData,
                    type: "GET",
                    success: function(returned_data) {
                        window.location.href = '/openboard';
                    }
                })

            }
        )
    });


}

