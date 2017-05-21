chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
	console.log(item);
	loadRules(function(rules) {
		var rule = getRuleByUrl(item.referrer, rules);
		if (!rule) {
			suggest({ filename: item.filename })
			return;
		}
		
		chrome.tabs.query({ currentWindow:true, active: true }, function(tabs) {
			tab = tabs[0];
			console.log(tab);
			chrome.tabs.sendMessage(tab.id, "get_filename_by_clicked_element", function(value) {
				console.log('Got filename by element: ' + value.filename);
				filename = value.filename + ' ' + item.filename;
				console.log('Final filename: ' + filename);
				suggest({ filename: filename });
			});
		});
	});
	return true;
});
console.log('Rename Downloads is listening on determinating filename.');
