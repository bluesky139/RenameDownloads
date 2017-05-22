var codeEditor;
var rules = [];

$(document).ready(function() {
	loadRules(function(rules) {
		init(rules);
	});
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
	$('#rule-delete').on('click', function(event) {
		deleteRule();
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
	
	$('.rule-item').removeClass('active');
	$('a[rule-id="' + ruleId + '"]').addClass('active');
	
	$('#rule-name h5').text(rule.name);
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
		Materialize.toast('Add rule first.', 2000)
		return;
	}
	
	var ruleName = $('#rule-name h5').text();
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

function deleteRule() {
	var ruleId = $('#rule-name').attr('rule-id');
	if (ruleId < 0) {
		Materialize.toast('Add rule first.', 2000)
		return;
	}
	
	console.log('Delete rule id: ' + ruleId);
	rules.splice(ruleId, 1);
	$('a[rule-id="' + ruleId + '"]').remove();
	
	if (ruleId >= rules.length) {
		ruleId = rules.length - 1;
	}
	if (ruleId >= 0) {
		switchToRule(ruleId);
	} else {
		clearForm();
	}
	
	saveRules();
}

function clearForm() {
	$('#rule-name h5').text('');
	$('#rule-name').attr('rule-id', -1);
	$('#rule-url').val('');
	codeEditor.getDoc().setValue('');
}

function saveRules() {
	chrome.storage.local.set({ 
		rules: rules
	}, function() {
		Materialize.toast('Saved.', 2000);
	});
}