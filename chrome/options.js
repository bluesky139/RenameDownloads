var codeEditor;
var rules = [];
$(document).ready(function() {
	loadRules(function(rules) {
		init(rules);
	});
	
	/* $('.rule-item-delete').on('click', function(event) {
		console.log(event.target);
	}); */
	
	
});

function init(rules) {
	codeEditor = CodeMirror.fromTextArea(document.getElementById("rule-code"), {
		lineNumbers: true,
		mode:  "javascript",
		gutters: ["CodeMirror-lint-markers"],
		lint: true
	});
	
	$.each(rules, function(i, rule) {
		newRule(rule, i == 0 ? true : false);
	});
	
	$('#rule-new').on('click', function(event) {
		var ruleName = $('#rule-new-name').val();
		if (!ruleName) {
			Materialize.toast("Input rule name first.", 2000);
			return;
		}
		if (isRuleNameDuplicated(ruleName)) {
			Materialize.toast("Rule name is duplicated.", 2000);
			return;
		}
		var rule = createRule(ruleName, '', new Array());
		newRule(rule, true);
	});
	
	$('#rule-save').on('click', function(event) {
		saveRule();
	});
}

function newRule(rule, withSwitch) {
	console.log('Add new rule: ' + rule.name);
	if (!rule.name) {
		throw "At least call newRule() with rule name.";
	}
		
	$('#rule-new-item').before(`
		<a href="#!" class="rule-item collection-item" rule-id="` + rules.length + `">` + rule.name + `</a>
	`);
	$('#rule-new-item').prev().on('click', function(event) {
		console.log('Rule item click, ' + event.target.text);
		$('.rule-item').removeClass('active');
		$(event.target).addClass('active');
		
		var ruleId = $(event.target).attr('rule-id');
		switchToRule(ruleId);
	});
	
	rules.push(rule);
	$('#rule-new-name').val('');
	
	if (withSwitch) {
		$('#rule-new-item').prev().click();
	}
}

function isRuleNameDuplicated(ruleName) {
	for (var i in rules) {
		if (rules[i].name == ruleName) {
			return true;
		}
	}
	return false;
}

function createRule(ruleName, code, urls) {
	if (!ruleName) {
		throw 'Rule name is empty.'
	}
	if (!$.isArray(urls)) {
		throw 'Rule urls is not an array.';
	}
	return {
		name: ruleName,
		code: code,
		urls: urls
	};
}

function switchToRule(ruleId) {
	console.log('Switch to rule: ' + ruleId);
	var rule = rules[ruleId];
	console.log(rule);
	
	$('#rule-name').text(rule.name);
	$('#rule-name').attr('rule-id', ruleId);
	
	rule = rules[ruleId];
	if (rule.urls) {
		$('#rule-url').val(rule.urls[0]);
	} else {
		$('#rule-url').val('');
	}
	codeEditor.getDoc().setValue(rule.code);
}

function saveRule() {
	var ruleId = $('#rule-name').attr('rule-id');
	if (ruleId < 0) {
		Materialize.toast('Can\'t save rule, rule id is ' + ruleId, 2000)
		return;
	}
	
	var ruleName = $('#rule-name').text();
	if (!ruleName) {
		Materialize.toast('Rule name is empty.');
		return;
	}
	
	console.log('Save rule id: ' + ruleId + ', name: ' + ruleName);
	var code = codeEditor.getDoc().getValue();
	var urls = new Array();
	if ($('#rule-url').val()) {
		urls.push($('#rule-url').val());
	}
	var rule = createRule(ruleName, code, urls);
	rules[ruleId] = rule;
	
	saveRules();
}

function saveRules() {
	chrome.storage.local.set({ 
		rules: rules
	}, function() {
		Materialize.toast('Saved.', 2000);
	});
}