let channelsDisplay = null;
let imgViewer = document.getElementById("imgViewer");
let sImages = document.getElementById("sImages");


/**
 * Download list of available images.
 */
function reloadImageList() {
	showDialogScreen("Please Wait.", "Loading your image.");

	xhr = new XMLHttpRequest();
	xhr.open("GET", "/get_available_images", true);
	xhr.onload = function(response) {
		if (this.readyState == 4 && this.status == 200) {
			let image_files = JSON.parse(this.responseText).data.image_files;

			for (let i = 0; i < image_files.length; i++)
				addOption(image_files[i])

			hideDialogScreen();

			loadImage(sImages.value);
		} else {
			showErrorMsg("Couldn't load your images.")
		}
	}
	xhr.send();
}

/**
 * Add list of available images to dropdown menu.
 */

function addOption(filename, setOption=false) {
	let option = document.createElement("option");
	option.innerHTML = filename;
	option.value = filename;
	sImages.appendChild(option);

	if (setOption)
		sImages.value = filename;
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

		if (this.readyState == 4 && this.status == 200) {
			addOption(iInputImage.files[0].name, true);
			loadImage(iInputImage.files[0].name);
			
			hideDialogScreen();
		} else {
			showErrorMsg("Couldn't upload image.")
		}

	}
	xhr.send(formData);
}

/**
 * Load the image selected
 */
function loadImage(filename) {
	showDialogScreen("Please Wait.", "Loading your image.");

	sImages = document.getElementById("sImages");

	if (filename != "" && filename != undefined) {

		hideHint();

		ChannelsDisplay.initialize(imgViewer, filename).then(function(cd) {
			channelsDisplay = cd;
			hideDialogScreen();
		});
	} else {
		hideDialogScreen();
		showHint("Click the + icon to add images.");
	}
}

function sImagesChanged() {
	loadImage(sImages.value);
}

/**
 * Toggle color channels
 */
function btnToggleChannelClicked(btn, channel) {
	btn.classList.toggle('active');
	channelsDisplay.toggleChannel(channel);
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

function showErrorMsg(error, refreshOption=true) {
	let dDialogScreen = document.getElementById("dDialogScreen");
	let pDialogScreenMsg = document.getElementById("pDialogScreenMsg");
	let hDialogScreenMsg = document.getElementById("hDialogScreenMsg");
	hDialogScreenMsg.innerHTML = "ERROR!";
	pDialogScreenMsg.innerHTML = error;
	dDialogScreen.classList.add("displayDialogScreen");
	dDialogScreen.classList.add("error");

	if (refreshOption)
		document.getElementById("btnRefresh").style.visibility = "all";	
}

function refreshPage(){
    window.location.reload();
}
