function send(action, data) {
    $.ajax({
        cache: false,
        type: "POST",
        url: action,
        data: data,
        dataType: "json",
        success: function(result, status, xhr) {
            window.location = result.redirect;
        },
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            alert(messageObj.error);
        }
    });        
}

function init() {
	// Opt in tooltips.
	$('[data-toggle="tooltip"]').tooltip({container: "body"});

	// Handle signup.
	$("#ssubmit").click(function(e) {
		e.preventDefault();
		if (username.value == "" || password.value == "" || password2.value == "") {
			alert("All fields required");
			return;
		}
		if (password.value !== password2.value) {
			alert("Passwords must match");
			return;
		}
		send($("#signup").attr("action"), $("#signup").serialize());
	});

	// Handle login.
	$("#lsubmit").click(function(e) {
		e.preventDefault();
		if (username.value == "" || password.value == "") {
			alert("All fields required");
			return;
		}
		send($("#login").attr("action"), $("#login").serialize());
	});

	// Handle set bio.
	$("#asubmit").click(function(e) {
		e.preventDefault();
		if(bio.value == "") {
			return;
		}
		send($("#account").attr("action"), $("#account").serialize());
		// TODO: provide user feedback for successful bio change.
	});
}

window.onload = init;