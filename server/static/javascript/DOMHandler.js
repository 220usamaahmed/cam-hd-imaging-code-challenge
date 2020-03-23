let channelsDisplay = null;
let imgViewer = document.getElementById("imgViewer");

function reloadImageList() {

	showDialogScreen("Please Wait.", "Loading your image.");

	let sImages = document.getElementById("sImages");
	sImages.innerHTML = "";

	xhr = new XMLHttpRequest();
	xhr.open("GET", "/get_available_images", true);
	xhr.onload = function(response) {
		if (this.readyState == 4 && this.status == 200) {
			let image_files = JSON.parse(this.responseText).data.image_files;
			
			for (let i = 0; i < image_files.length; i++) {
				let option = document.createElement("option");
				option.innerHTML = image_files[i];
				option.value = image_files[i];
				sImages.appendChild(option);
			}

			loadImage();
			hideDialogScreen();

		} else {
			// TODO: Display error.
		}
	}
	xhr.send();
}

function showHint(hint) {
	document.getElementById("hHint").innerHTML = hint;
}

function hideHint() {
	document.getElementById("hHint").innerHTML = "";
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

/**
 * Toggle color channels
 */
function btnToggleChannelClicked(btn, channel) {
	btn.classList.toggle('active');
	channelsDisplay.toggleChannel(channel);
}

/**
 * Load the image selected
 */
function loadImage() {
	showDialogScreen("Please Wait.", "Loading your image.");

	sImages = document.getElementById("sImages");
	filename = sImages.value;

	if (filename != "") {

		hideHint();

		ChannelsDisplay.initialize(imgViewer, filename).then(function(cd) {
			channelsDisplay = cd;
			hideDialogScreen();
		});
	} else {
		showHint("Click the + icon to add images.");
	}
}

/**
 * Upload image and reload available images.
 */
function iInputImageClicked() {

	showDialogScreen("Please Wait.", "Uploading Image");

	let iInputImage = document.getElementById("iInputImage");

	let formData = new FormData();
	formData.append("inputImage", iInputImage.files[0]);
	
	xhr = new XMLHttpRequest();
	xhr.open("POST", "/upload_image", true);
	xhr.onload = function(response) {
		console.log(response);
		hideDialogScreen();
		reloadImageList();
	}
	xhr.send(formData);

}