// Code from chat homework that might be repurposed
/*function connectSocket() {
	var chat = document.querySelector("#chat");
	var message = document.querySelector("#message");
	var user = document.querySelector("#username").value;
	var currentUsername = document.querySelector("#currentUsername");
	var dieRoll = document.querySelector("#dieRoll");
	var socket = io();  
	
	// Error checking for no username entered.
		// Example: anon1232
	if (!user) {
		user = "anon" + Math.floor(Math.random() * 100);
	}

	// Sent currentUsername box value.
	currentUsername.value = user;

	// If currentUsername box blurs and name has changed, update name change and emit change to room.
	currentUsername.addEventListener("blur", function() {
		if (currentUsername.value != user) {
			var namechange = currentUsername.value;
			socket.emit("usernameChange", {name: user, newname: namechange});
			user = namechange;
		}
	});

	// listener for connect event
	socket.on("connect", function() {
		//console.log("connecting");
		
		socket.emit("join", {name: user});

		// Send message on Enter key event.
		// If user starts message with "/", server speaks action.
			// Example: /dances -> server: mandy dances
		message.addEventListener("keydown", function(e) {
			if (e.which == 13 && message.value != "") {
				if (message.value[0] != "/") {
					socket.emit("msgToServer", {name: user, msg: message.value});
				} else {
					socket.emit("action", {name: user, action: message.value.substring(1)})
				}
				message.value = "";
			}
		});
		
		// listener for disconnect event
		socket.on("disconnect", function() {
			//console.log(user + " has disconnected");
			socket.emit("disconnect", {name: user});
		});
	});
	
	// listener for msg event
	socket.on("msg", function(data) {
		//console.log(data);
		chat.innerHTML += ("<p>" + data.name + ": " + data.msg + "</p>");
		chat.scrollTop = chat.scrollHeight;
	});
}*/

function sendAjax(action, data) {
    $.ajax({
        cache: false,
        type: "POST",
        url: action,
        data: data,
        dataType: "json",
        success: function(result, status, xhr) {
            $("#domoMessage").animate({width:'hide'},350);

            window.location = result.redirect;
        },
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
        
            handleError(messageObj.error);
        }
    });        
}

function init() {
	/*
	// Prompt user for nickname and connect.
	var connect = document.querySelector("#connect");
	connect.addEventListener("click", function() {
		// Connect.
		connectSocket();

		// Hide username prompt.
		document.querySelector("#userPromptDiv").style.display = "none";

		// Get keypress event to start typing in message box.
		document.addEventListener("keypress", function() {
			if (document.querySelector("#currentUsername") !== document.activeElement) {
				document.querySelector("#message").focus();
			}
		});
	});*/
	var sform = document.querySelector("#signup");
	var lform = document.querySelector("#login");
	var username = document.querySelector("#username");
	var password = document.querySelector("#password");
	var password2 = document.querySelector("#password2");

	$("ssubmit").onclick = function(e) {
		e.preventDefault();
		if (username.value == "" || password.value == "" || password2.value == "") {
			alert("All fields required");
			return;
		}
		if (password.value !== password2.value) {
			alert("Passwords must match");
			return;
		}
		sendAjax(sform.attr("action"), sform.serialize());
	};

	$("lsubmit").onclick = function(e) {
		e.preventDefault();
		if (username.value == "" || password.value == "" || password2.value == "") {
			alert("All fields required");
			return;
		}
		sendAjax(lform.attr("action"), lform.serialize());
	};
}

window.onload = init;