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
	// Opt in tooltips for Bootstrap.
	$('[data-toggle="tooltip"]').tooltip({container: "body"});

	//------------------------------ Event handlers.
	// Signup. (signup.jade)
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

	// Login. (login.jade)
	$("#lsubmit").click(function(e) {
		e.preventDefault();
		if (username.value == "" || password.value == "") {
			alert("All fields required");
			return;
		}
		send($("#login").attr("action"), $("#login").serialize());
	});

	// Set bio. (account.jade)
	$("#asubmit").click(function(e) {
		e.preventDefault();
		if(bio.value == "") {
			return;
		}
		send($("#account").attr("action"), $("#account").serialize());
		// TODO: provide user feedback for successful bio change.
	});

	// ----- Adding a new contact.
	// Open contacts drawer.
	$("#opencontactdrawer").click(function(e) {
		e.preventDefault();
		$("#contacts").show();

		// Close chats if it's open.
		$("#chats").hide();
	});

	// Show add contact. (app.jade, account.jade, about.jade)
	$("#add_contact").click(function(e) {
		$("#addcontact").show();
	});

	// Add contact. (app.jade, account.jade, about.jade)
	$("#csubmit").click(function(e) {
		e.preventDefault();
		if(username.value == "") {
			alert("Username required");
			return;
		}
		send($("#addcontact").attr("action"), $("#addcontact").serialize());
	});

	// Close chats drawer. (app.jade, account.jade, about.jade)
	$("#close_contacts").click(function(e) {
		$("#contacts").hide();
	});

	// ----- Adding a new chat.
	// Open chats drawer.
	$("#openchatdrawer").click(function(e) {
		e.preventDefault();
		$("#chats").show();

		// Close contacts if it's open.
		$("#contacts").hide();
	});

	// Show add chat. (app.jade, account.jade, about.jade)
	$(".add_chat").click(function(e) {
		$("#addchat").show();
	});

	// Add chat. (app.jade, account.jade, about.jade)
	$("#chsubmit").click(function(e) {
		if(username.value == "" || message.value == "") {
			alert("All fields required");
			return;
		}
		send($("#addchat").attr("action"), $("#addcontact").serialize());
	});

	// Close add chat and add contact forms. (app.jade, account.jade, about.jade)
	$(".closebox").click(function(e) {
		$("#addchat").hide();
		$("#addcontact").hide();
	});

	// Close chats drawer. (app.jade, account.jade, about.jade)
	$("#close_chats").click(function(e) {
		$("#chats").hide();
	});
}

window.onload = init;