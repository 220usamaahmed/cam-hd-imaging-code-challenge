function initializeCanvas() {
	let canvas = document.getElementById("cViewer");

	canvas.parentNode.style.position = "relative";
	canvas.style.position = "absolute";
	canvas.width = canvas.parentNode.offsetWidth;
	canvas.height = canvas.parentNode.offsetHeight;
	canvas.style.width ='100%';
	canvas.style.height='100%';

	return canvas.getContext("2d");
}

function reloadImageList() {
	let sImages = document.getElementById("sImages");

	xhr = new XMLHttpRequest();
	xhr.open("GET", "/get_available_images", true);
	xhr.onload = function(response) {
		if (this.readyState == 4 && this.status == 200) {
			let image_files = JSON.parse(this.responseText).data.image_files;
			
			for (let i = 0; i < image_files.length; i++) {
				let option = document.createElement("option");
				option.innerHTML = image_files[i];
				sImages.appendChild(option);
			}
		} else {
			// Display error.
		}
	}
	xhr.send();
}

function showHint(hint) {

}

function hideHint() {

}

function showDialogScreen(message_h="Please Wait", message_p="") {
	let dDialogScreen = document.getElementById("dDialogScreen");
	let pDialogScreenMsg = document.getElementById("pDialogScreenMsg");
	let hDialogScreenMsg = document.getElementById("hDialogScreenMsg");
	hDialogScreenMsg.innerHTML = message_h;
	pDialogScreenMsg.innerHTML = message_p;
	dDialogScreen.classList.add("displayDialogScreen");
}

function hideDialogScreen() {
	let dDialogScreen = document.getElementById("dDialogScreen");
	let pDialogScreenMsg = document.getElementById("pDialogScreenMsg");
	let hDialogScreenMsg = document.getElementById("hDialogScreenMsg");
	hDialogScreenMsg.innerHTML = "";
	pDialogScreenMsg.innerHTML = "";
	dDialogScreen.classList.remove("displayDialogScreen");	
}

function showErrorMsg(error) {

}

function initializeImage() {

}

function btnToggleChannelClicked(btn, channel) {
	btn.classList.toggle('active');
	channelsDisplay.toggleChannel(channel);
}



















function iInputImageClicked() {

	let iInputImage = document.getElementById("iInputImage");

	let formData = new FormData();
	formData.append("inputImage", iInputImage.files[0]);
	
	xhr = new XMLHttpRequest();
	xhr.open("POST", "/upload_image", true);
	xhr.onload = function(response) {
		console.log(response);
	}
	xhr.send(formData);

}