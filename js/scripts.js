$(document).ready(function() {

	// a function to turn a single digit number into a double digit number with a zero at the beginning
	function dubDig(x) {
		var y;
		var digCount = x.toString().length;
		if (digCount == 0) {
			y = '00';
		} else if (digCount == 1) {
			y = '0' + x;
		} else if (digCount == 2) {
			y = x;
		} else {
			y = x.replace(/^0+/, '');
		}
		return y;
	}

	function tripDig(x) {
		var y;

		var digCount = x.toString().length;
		if (digCount == 0) {
			y = '000';
		} else if (digCount == 1) {
			y = '00' + x;
		} else if (digCount == 2) {
			y = '0' + x;
		} else if (digCount == 3) {
			y = x;
		} else {
			y = x.replace(/^0+/, '');
		}

		return y;
	}

	// functions to number rows and add appropriate classes
	$('.row-number').each(function(i) {
		$(this).html(i + 1);
	});

	//variable of html for new sub
	var sub = '<div class="row sub"><div class="col-md-1"><div class="row"><div class="col-md-12 row-controls"><i class="fa fa-times row-control" aria-hidden="true"></i><i class="fa fa-bars row-control" aria-hidden="true"></i></div></div><div class="row"><div class="col-md-12 row-number"></div></div></div><div class="col-md-2"><div class="row"><div class="col-md-12 label-wrapper">Start Time:</div></div><div class="row"><div class="col-md-4 number-wrapper"><input class="start-min number" max="59" placeholder="mm"></div><div class="col-md-4 number-wrapper"><input class="start-sec number" max="59" placeholder="ss"></div><div class="col-md-4 number-wrapper"><input class="start-msec number" max="999" placeholder="mms"></div></div></div><div class="col-md-2"><div class="row"><div class="col-md-12 label-wrapper">End Time:</div></div><div class="row"><div class="col-md-4 number-wrapper"><input class="end-min number" max="59" placeholder="mm"></div><div class="col-md-4 number-wrapper"><input class="end-sec number" max="59" placeholder="ss"></div><div class="col-md-4 number-wrapper"><input class="end-msec number" max="999" placeholder="mms"></div></div></div><div class="col-md-6"><div class="row"><div class="col-md-12 label-wrapper">Subtitle:</div></div><div class="row"><div class="col-md-12 subtitle-wrapper"><input class="subtitle-text" type="text"></div></div></div><div class="col-md-1"><div class="row"><div class="col-md-12 label-wrapper">Style:</div></div><div class="row"><div class="col-md-12 style-wrapper"><div class="style-select"><div class="style-selected options-hidden"><span data-style="none">None<i class="fa fa-caret-down" aria-hidden="true"></i></span></div><div class="style-select-option style-select-option-hidden"><span data-style="none">None</span></div><div class="style-select-option style-select-option-hidden"><span data-style="bold"><i class="fa fa-bold" aria-hidden="true"></i></span></div><div class="style-select-option style-select-option-hidden"><span data-style="italic"><i class="fa fa-italic" aria-hidden="true"></i></span></div><div class="style-select-option style-select-option-hidden"><span data-style="underline"><i class="fa fa-underline" aria-hidden="true"></i></span></div></div></div></div></div></div>';

	// restrict inputs
	$(document).on('keyup', 'input.number', function() {

		var max = Number($(this).attr('max'));
		var str = $(this).val();
		var val = Number($(this).val());

		if (val > max || isNaN(val)) {

			str = str.slice(0, -1);
			$(this).val(str);

		}
	});

	//remove download link when you change stuff
	$(document).on('keyup', 'input', function() {

		$('#downloadlink').css('display', 'none');

	});

	// add row
	$('.control-add').click(function() {

		// make the first sub sortable
		$('.sub-first').removeClass('sub-no-sort');
		$('.row-control').removeClass('row-control-disable');

		var count = Number($('.row-number').each(function() {
		}).length) + 1;
		$('#subs').append(sub);

		$('.row-number').each(function(i) {
			$(this).html(i + 1);
		});
	});

	// create file
	$('.control-create').click(function() {

		$('#output').html('');

		// variable to count the number of subtitles
		var len = $('.sub').length;

		$('.sub').each(function(i) {

			// variables taken from the subtitle to put into the output
			var num = i + 1;
			var startMin = dubDig($(this).find('.start-min').val());
			var startSec = dubDig($(this).find('.start-sec').val());
			var startMsec = tripDig($(this).find('.start-msec').val());
			var endMin = dubDig($(this).find('.end-min').val());
			var endSec = dubDig($(this).find('.end-sec').val());
			var endMsec = tripDig($(this).find('.end-msec').val());
			var sub = $(this).find('.subtitle-text').val();
			console.log(sub);

			// style variable
			function styleCheck(x) {
				var y = {
					start : '',
					end : ''
				};
				if (x == 'bold') {
					y.start = '&lt;b&gt;';
					y.end = '&lt;/b&gt;'
				} else if (x == 'italic') {
					y.start = '&lt;i&gt;';
					y.end = '&lt;/i&gt;'
				} else if (x == 'underline') {
					y.start = '&lt;u&gt;';
					y.end = '&lt;/u&gt;'
				}
				return y;

			}

			var style = $(this).find('.style-selected span').attr('data-style');
			
			var styleStart = styleCheck(style).start;
			var styleEnd = styleCheck(style).end;

			// append the parsed subtitle to the output
			$('#output').append(num + '&#13;00:' + startMin + ':' + startSec + ',' + startMsec + ' --> 00:' + endMin + ':' + endSec + ',' + endMsec + '&#13;' + styleStart + sub + styleEnd);

			//add a line break after the subtitle unless it's the last subtitle
			if (i < (len - 1)) {
				$('#output').append('&#13;&#13;');
			}
		});

	});

	//make subtitles sortable
	$('#subs').sortable({
		cancel : '.sub-no-sort',
		handle : '.fa-bars',
		stop : function() {
			$('.sub').removeClass('sub-first');
			//have to re-do the counts
			$('.row-number').each(function(i) {
				$(this).html(i + 1);
			});
		}
	});

	//remove subtitle

	//need to use 'event' delegation because for some reason a click event is not firing on dynamically created elements
	$(document).on('click', '.fa-times', function() {
		$(this).closest('.sub').remove();
		// have to re-do counts
		var len = $('.row-number').each(function(i) {
			$(this).html(i + 1);
		}).length;
		// if there's only one row
		if (len == 1){
			$('.fa-bars').addClass('row-control-disable');
			$('.sub').addClass('sub-no-sort');
		}
	});

	// download subtitle (tutorial : https://jsfiddle.net/uselesscode/qm5ag/)
	(function() {
		var textFile = null, makeTextFile = function(text) {
			var data = new Blob([text], {
				type : 'text/plain'
			});

			// If we are replacing a previously generated file we need to
			// manually revoke the object URL to avoid memory leaks.
			if (textFile !== null) {
				window.URL.revokeObjectURL(textFile);
			}

			textFile = window.URL.createObjectURL(data);

			return textFile;
		};

		var create = document.getElementById('create'), textbox = document.getElementById('output')

		create.addEventListener('click', function() {

			var link = document.getElementById('downloadlink');
			link.href = makeTextFile(textbox.value);
			link.style.display = 'block';
		}, false);
	})();

	// this is a function to toggle the dropdown, hide/show
	$(document).on('click', '.style-selected', function() {

		if ($(this).hasClass('options-hidden')) {
			$(this).removeClass('options-hidden').addClass('options-shown');
			$(this).parent().find('.style-select-option').show();
			$('.style-select-option').removeClass('style-select-option-hidden').addClass('style-select-option-shown');
		} else if ($(this).hasClass('options-shown')) {
			$('.style-select').show();
			$(this).removeClass('options-shown').addClass('options-hidden');
			$('.style-select-option').hide();
			$('.style-select-option').removeClass('style-select-option-shown').addClass('style-select-option-hidden');
		}

	});

	// this is a function to select a new style
	$(document).on('click', '.style-select-option', function() {

		// select it
		var html = $(this).html();
		var text = $(this).text();

		$(this).parent().find('.style-selected').html(html + '<i class="fa fa-caret-down" aria-hidden="true"></i>');

		// condition for selected cell padding
		if (text.trim() == 'None') {
			$(this).parent().find('.style-selected').css({
				'padding-top' : '2px',
				'padding-bottom' : '2px'
			});
			$(this).parent().find('.style-selected .fa-caret-down').css({
				'margin-top' : '3px'
			});
		} else {
			$(this).parent().find('.style-selected').css({
				'padding-top' : '5px',
				'padding-bottom' : '5px'
			});
			$(this).parent().find('.style-selected .fa-caret-down').css({
				'margin-top' : '0px',
			});
		}

		//hide the menu
		$('.style-selected').removeClass('options-shown').addClass('options-hidden');
		$('.style-select-option').hide();
		$('.style-select-option').removeClass('style-select-option-shown').addClass('style-select-option-hidden');
	});

});
