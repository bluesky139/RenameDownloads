var clickedElement;

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
		if(request == "get_filename_by_clicked_element") {
			console.log("Requesting get_filename_by_clicked_element");
			console.log(rule.code);
			
			var filename = eval(rule.code);
			console.log(filename);
			sendResponse({ filename: filename });
		}
	});
	console.log("Rename Downloads is loaded.");
}
