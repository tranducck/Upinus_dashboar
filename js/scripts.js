$(document).ready(function() {

	var theWin    = $(window),
		curWh     = theWin.height(),
		curWw     = theWin.width(),
		$body     = $('body'),
		htmlWrap  = document.getElementsByTagName('html')[0],
		bodyWrap  = document.getElementsByTagName('body')[0];

	function firstRun() {
		
		$('.svg-icon img').each(function(){
			var $img = $(this);
			var imgURL = $img.attr('src');

			$.get(imgURL, function(data) {
				// Get the SVG tag, ignore the rest
				var $svg = $(data).find('svg');

				// Remove any invalid XML tags as per http://validator.w3.org
				$svg = $svg.removeAttr('xmlns:a');

				// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
				if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
				    $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
				}

				// Replace image with new SVG
				$img.replaceWith($svg);

			}, 'xml');

		});
	}

	var pageLoad_check = setInterval(function() {
		if (bodyWrap.className.trim().split(/\s+/).indexOf("page_done_loaded") > -1) {
			firstRun();
			clearInterval(pageLoad_check);
		}
	},100);

	if ($('input.datepicker').length > 0) {
		$('input.datepicker').Zebra_DatePicker({format: 'd/m/Y'});
	}

	$(document).on('focus', 'input', function() {
		$('.focused').blur().removeClass('focused');
		$('.ac_selected').removeClass('ac_selected');
		$(this).parent('.input-wrap').addClass('focused');
	});

	$(document).on('blur', 'input', function() {
		if (!$(this).hasClass('auto_complete_input')) {
			$(this).parent('.input-wrap').removeClass('focused');
		}
		if ($(this).val() != '') {
			$(this).parent('.input-wrap').addClass('filled');
		} else {
			$(this).parent('.input-wrap').removeClass('filled');
		}
	});

	$(document).on('click', '.body_nav-notificator, .setting_menu_trigger', function(event) {
		$(this).toggleClass('show_drop');
		return false;
	});

	$(document).on('click', '.side_nav-toggle', function(event) {
		setTimeout(function() {
			window.dispatchEvent(new Event('resize'));
		},300);
	});

	$(document).on('click', '[check-target]', function(event) {
		var check_target = $(this).attr('check-target'),
			checkboxes = $('input[type="checkbox"][check-label="'+check_target+'"]'),
			checked = $('input[type="checkbox"][check-label="'+check_target+'"]:checked');

		if (checked.length < checkboxes.length) {
			checkboxes.prop('checked',true).change();
			console.log("Let's check it all!");
		} else {
			checkboxes.prop('checked',false).change();
			console.log("Let's uncheck everything!");
		}

		return false;
	});

	var checkCheck = function(check_label) {
		var checkboxes = $('input[type="checkbox"][check-label="'+check_label+'"]'),
			checked = $('input[type="checkbox"][check-label="'+check_label+'"]:checked');

		if (checked.length < checkboxes.length) {
			console.log("You can now check it all");
			$('[check-target="'+check_label+'"]').removeClass('uncheck').children('.tooltip').text('Check all');
		} else {
			console.log("You can now uncheck it all!");
			$('[check-target="'+check_label+'"]').addClass('uncheck').children('.tooltip').text('Uncheck all');
		}

		if (checked.length > 0) {
			$('.table_actions_menu[check-action="'+check_label+'"]').addClass('active');
		} else {
			$('.table_actions_menu[check-action="'+check_label+'"]').removeClass('active');
		}

		$('[check-counter]').text(checked.length);
	}

	$(document).on('change', 'input[type="checkbox"][check-label]', function(event) {
		var check_target = $(this).attr('check-label');

		if ($(this).prop('checked') == true) {
			$(this).parent().parent('.pinned_item').addClass('pin_selected');
		} else {
			$(this).parent().parent('.pinned_item').removeClass('pin_selected');
		}

		checkCheck(check_target);
	});

	$(document).on('mousemove', '.hover_card_wrap', function(event) {
		var e    = window.event,
			posX = e.clientX,
			posY = e.clientY,
			wrpX = $(this).offset().left,
			wrpY = $(this).offset().top,
			csrX = posX-wrpX+30,
			csrY = posY-wrpY+$(window).scrollTop();

		$(this).children('.hover_card').css({'top':csrY,'left':csrX});
	});

	$(document).on('click', '.parent_row', function(event) {
		$('.parent_row.active').not(this).removeClass('active');
		$(this).toggleClass('active');
		return false;
	});

	$(document).on('click', '.tab-btn', function(event) {
		var tab_target = $(this).attr('tab-target');
		$('.tab-btn.active').not(this).removeClass('active');
		$(this).addClass('active');
		$('.product-description-tab.active').removeClass('active');
		$('.product-description-tab#'+tab_target).addClass('active');
		return false;
	});

	$(document).on('click', '.close-popup, .overlayer, .end-popup', function(event) {
		$('.block-popup.active').removeClass('active');
		return false;
	});

	$(document).on('click', '.start-popup', function(event) {
		var popup_target = $(this).attr('popup-target');
		$('.block-popup#'+popup_target).addClass('active');
		return false;
	});

	$(document).on('click', '.body_chart-info-menu-toggle', function(event) {
		$('.body_chart-info-menu-toggle').not(this).removeClass('active');
		$(this).toggleClass('active');
		return false;
	});

	$(document).on('click', '.parent-item', function(event) {
		$(this).toggleClass('active');
		return false;
	});

	$(document).on('click', '.change_price_trigger', function(event) {
		$('.change_price_trigger').not(this).removeClass('active');
		$(this).toggleClass('active');
		return false;
	});

	$('.auto_complete_data span').each(function() {
		var sval = $(this).text(),
			sinput = $(this).parent().attr('data-value'),
			ac_id  = 'ac_'+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		$(this).attr('data-id',ac_id).addClass('cleardata');
		if ($(this).is('[selected]')) {
			$(this).addClass('placed').removeClass('cleardata');
			$(this).parent().parent('.input-wrap').children('.auto_complete_placeholder').append('<div class="ac_tag" ac-id="'+ac_id+'">'+sval+'<span></span></div>');
		}
	});

	$(document).on('click', '.auto_complete_data:not(.auto_complete_data_placing) span', function(event) {
		var sval = $(this).text(),
			sinput = $(this).parent().attr('data-value');

		$('#'+sinput).val(sval);
		$(this).parent().parent('.input-wrap').removeClass('focused');
		return false;
	});

	$(document).on('click', '.auto_complete_data.auto_complete_data_placing span', function(event) {
		var sval = $(this).text(),
			sinput = $(this).parent().attr('data-value'),
			ac_id  = $(this).attr('data-id');

		$('#'+sinput).val('').focus();
		$(this).addClass('placed').removeClass('cleardata');
		$(this).parent().parent('.input-wrap').children('.auto_complete_placeholder').append('<div class="ac_tag" ac-id="'+ac_id+'">'+sval+'<span></span></div>');
		return false;
	});

	$(document).on('click', '.ac_tag span', function(event) {
		var ac_id  = $(this).parent().attr('ac-id');

		$(this).parent().parent().next('.input').focus();
		$(this).parent().remove();
		$('[data-id="'+ac_id+'"]').removeClass('placed').addClass('cleardata');
	});

	$(document).on('keyup', '.auto_complete_input', function(event) {
		var sval = String($(this).val()).toLowerCase(),
			sinput = $(this).attr('id'),
			sdata  = $(this).parent().children('.auto_complete_data[data-value="'+sinput+'"]');

		if (sval != '') {
			sdata.addClass('exclude');
		} else {
			sdata.removeClass('exclude').removeClass('ac_empty');
		}

		sdata.children('span').each(function() {
			var optionval = String($(this).text()).toLowerCase();
			if (optionval.indexOf(sval) > -1 && sval != '') {
				$(this).addClass('highlight');
			} else {
				$(this).removeClass('highlight');
			}
			if (sdata.children('.highlight').length == 0 && sval != '') {
				sdata.addClass('ac_empty');
				if (sdata.hasClass('ac_type_tag')) {
					sdata.attr('empty-placeholder', 'Add new "'+sval+'" tag by press Enter or Comma');
				}
			} else {
				sdata.removeClass('ac_empty');
			}
		});
	});

	$(document).on('keydown', '.auto_complete_input', function(event) {
		var text = $(this).val(),
			key = event.which || event.keyCode || event.charCode;

		if (key == 40) {
			$(this).next('.auto_complete_data').children('span.cleardata:first').addClass('ac_selected first_ac_selected');
			$(this).blur();
		}
	});

	$(document).on('keydown', '.auto_complete_input.auto_complete_placing', function(event) {
		var text = $(this).val(),
			key = event.which || event.keyCode || event.charCode;

		if (key == 8 && text == '') {
			var last_tag = $(this).prev('.auto_complete_placeholder').children('.ac_tag:last-child'),
				ac_id    = last_tag.attr('ac-id');
			last_tag.remove();
			$('[data-id="'+ac_id+'"]').removeClass('placed').addClass('cleardata');
		}
	});

	$(document).on('keydown', '.auto_complete_input.ac_tag_input', function(event) {
		var text = $(this).val(),
			key = event.which || event.keyCode || event.charCode;

		if (key == 13) {
			$(this).prev('.auto_complete_placeholder').append('<div class="ac_tag ac_new_tag">'+text+'<span></span></div>');
			$(this).val('').focus();
		}
	});

	$(document).on('keydown', function(event) {
		var key = event.which || event.keyCode || event.charCode,
			slected = $('.ac_selected');

		if ((key == 40 || key == 38 || key == 32 || key == 13) && slected.length > 0) {
			event.preventDefault();
			if (key == 40 && slected.next().length > 0) {
				console.log('Down on everything!');
				if (slected.hasClass('first_ac_selected')) {
					slected.removeClass('first_ac_selected');
				} else {
					slected.removeClass('ac_selected').nextAll('.cleardata:first').addClass('ac_selected');
				}
			}
			if (key == 38) {
				if (slected.prevAll('.cleardata:first').length == 0) {
					slected.parent().prev('input').focus();
				}
				slected.removeClass('ac_selected').prevAll('.cleardata:first').addClass('ac_selected');
			}
			if (key == 13) {
				slected.click().removeClass('ac_selected');
			}
		}

	});

	$(document).on('click', '.trigger-push', function(event) {
		var $this = $(this);
		if (!$(this).hasClass('pushing')) {
			$(this).addClass('pushing');
			setTimeout(function() {
				$this.removeClass('pushing').next('.push-status').addClass('triggered');
			},3000);
			setTimeout(function() {
				$this.next('.push-status').removeClass('triggered');
			},6000);
		}
		return false;
	});

	$(document).mouseup(function (e) {
		var container = $(".body_chart-info-menu, .body_nav-drop_menu, .show_drop, .change_price_trigger, .change-price-options, .focused");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			$('.body_chart-info-menu-toggle, .change_price_trigger').removeClass('active');
			$('.show_drop').removeClass('show_drop');
			$('.focused').removeClass('focused');
			$('.ac_selected').removeClass('ac_selected');
		}
	});
	
});