$("#form").submit(function(e) {
    e.preventDefault();
});

function checkCredentials() {
	const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="pass"]').value;
    const confirmPassword = document.querySelector('input[name="cnfrmpass"]').value;
    console.log('data_d');
    
    if(password === confirmPassword) {
        var data_d = {'email': email, 'pass': password};
        console.log('data_d', data_d);
        // window.location.href = "/home";
        // SEND DATA TO SERVER VIA jQuery.ajax({})
    
     
        jQuery.ajax({
            url: "/registeruser",
            data: data_d,
            type: "POST",
            success: function(data) {
                console.log('data', data);
                if(data === 'success') {
                    window.location.href = "/home";
                } else {
                    alert("User already exists");
                }
            },
            
        });
    } else {
        alert("Passwords do not match");
    }
    
}

