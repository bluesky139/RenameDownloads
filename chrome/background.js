chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
	console.log('Downloading item: ↓');
	console.log(item);
	
	if (item.referrer) {
		determiningFilename(item, suggest, item.referrer);
	} else {
		chrome.tabs.query({ currentWindow:true, active: true }, function(tabs) {
			var tab = tabs[0];
			determiningFilename(item, suggest, tab.url);
		});
	}
	return true;
});

function determiningFilename(item, suggest, referrer) {
	if (!referrer) {
		console.log('No referrer');
		suggest({ filename: item.filename });
		return;
	}
	
	loadRules(function(rules) {
		var rule = getRuleByUrl(referrer, rules);
		if (!rule) {
			suggest({ filename: item.filename })
			return;
		}
		
		chrome.tabs.query({ currentWindow:true, active: true }, function(tabs) {
			var tab = tabs[0];
			console.log('Current tab: ↓');
			console.log(tab);
			chrome.tabs.sendMessage(tab.id, "get_filename_by_clicked_element", function(value) {
				console.log('Got filename by element: ' + value.filename);
				if (value.filename) {
					filename = value.filename.replace(/[~<>:"/\\|?*\0]/g, '_') + ' ' + item.filename;
					console.log('Final filename: ' + filename);
					suggest({ filename: filename });
				} else {
					suggest({ filename: item.filename });
				}
			});
		});
	});
}

console.log('Rename Downloads is listening on determinating filename.');
