function loadRules(callback) {
	chrome.storage.local.get({
        rules: []
    }, function(items) {
		items['rules'].forEach(function(rule) {
			if (!('appendOriginalFilename' in rule)) {
				rule.appendOriginalFilename = true;
			}
		});
		console.log('Rules: ↓');
		console.log(items);
        callback(items['rules']);
	});
}

function getRuleByUrl(url, rules) {
	for (var i in rules) {
		var rule = rules[i];
		var urls = rule.urls;
		for (var j in urls) {
			if (url.startsWith(urls[j])) {
				return rule;
			}
		}
	}
}