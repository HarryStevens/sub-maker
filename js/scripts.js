$(document).ready(function() {

	// a function to turn a single digit number into a double digit number with a zero at the beginning
	function dubDig(x) {
		var y;
		var digCount = x.toString().length;
		if (digCount == 1) {
			y = '0' + x;
		} else if (digCount == '') {
			y = '00';
		} else {
			y = x;
		}
		return y;
	}

	// functions to number rows and add appropriate classes
	$('.row-number').each(function(i) {
		$(this).html(i + 1);
	});

	//variable of html for new sub
	var sub = '<div class="row sub"><div class="col-md-1"><div class="row"><div class="col-md-12 row-controls"><i class="fa fa-times row-control" aria-hidden="true"></i><i class="fa fa-bars row-control" aria-hidden="true"></i></div></div><div class="row"><div class="col-md-12 row-number"></div></div></div><div class="col-md-2"><div class="row"><div class="col-md-12">Start Time:</div></div><div class="row"><div class="col-md-6"><input class="start-min number" max="59" placeholder="mm"></div><div class="col-md-6"><input class="start-sec number" max="59" placeholder="ss"></div></div></div><div class="col-md-2"><div class="row"><div class="col-md-12">End Time:</div></div><div class="row"><div class="col-md-6"><input class="end-min number" max="59" placeholder="mm"></div><div class="col-md-6"><input class="end-sec number" max="59" placeholder="ss"></div></div></div><div class="col-md-7"><div class="row"><div class="col-md-12">Subtitle:</div></div><div class="row"><div class="col-md-12"><input class="subtitle-text" type="text"></div></div></div></div>';

	// restrict inputs
	$('input.number').keyup(function() {

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
			var endMin = dubDig($(this).find('.end-min').val());
			var endSec = dubDig($(this).find('.end-sec').val());
			var sub = $(this).find('.subtitle-text').val();

			// append the parsed subtitle to the output
			$('#output').append(num + '&#13;00:' + startMin + ':' + startSec + ',000 --> 00:' + endMin + ':' + endSec + ',000&#13;' + sub);

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
		$('.row-number').each(function(i) {
			$(this).html(i + 1);
		});
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

});
