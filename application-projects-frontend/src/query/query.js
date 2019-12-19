var $ = require('jquery');

$(document).ready(() => {
	$('button#loginBtn').click(() => {
		$('div.modal').css('display', 'flex');
	});

	$('button#closeModal').click(() => {
		$('div.modal').css('display', 'none');
	});
});