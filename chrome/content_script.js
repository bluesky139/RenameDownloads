var clickedElement;
var originalFilename;

loadRules(function(rules) {
	var rule = getRuleByUrl(window.location.href, rules);
	if (!rule) {
		return;
	}
	init(rule);
});

function init(rule) {
	document.addEventListener("mousedown", function(event){
		console.log("mousedown event button " + event.button);
		clickedElement = event.target;
		console.log(clickedElement);
	}, true);

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.action == "get_filename_by_clicked_element") {
			originalFilename = request.originalFilename;
			console.log("Requesting get_filename_by_clicked_element, original filename " + originalFilename);
			console.log(rule.code);
			
			var filename = null;
			try {
				filename = eval(rule.code);
			} catch (err) {
				console.log('Can\'t get filename, ' + err);
			}
			console.log('Filename: ' + filename);
			sendResponse({ filename: filename });
		}
	});
	console.log("Rename Downloads is loaded.");
}
