(function($){

 	$.fn.extend({ 

 		writepub_editor: function(options) {
			
			//alert("MSIE = " + $.browser.msie);
			//alert("Safari = " + $.browser.safari);
			//alert("Opera = " + $.browser.opera);
			//alert("Mozilla = " + $.browser.mozilla);
			//alert("Webkit = " + $.browser.webkit);
			
			if(!$.browser.msie && !$.browser.mozilla && !$.browser.webkit) return;
			
			id = $(this).attr("id");
			classes = $(this).attr("class");
			style = $(this).attr("style");
			
			writepub_editor.insert_toolbar(this[0]);
			writepub_editor.image_dialog_box.setup(this[0]);
			writepub_editor.link_dialog_box.setup(this[0]);
			writepub_editor.video_dialog_box.setup(this[0]);
			
			$(this).replaceWith('<iframe id="' + id + '"></iframe>');
			
			$('#'+id).attr("class", classes);
			$('#'+id).attr("style", style);
			
			setTimeout(function() {
				var self = $('#'+id);
			
				$(self).attr("class", classes);
				$(self).attr("style", style);
				
				$(self).contents()[0].designMode = "on";
				$(self)[0].contentEditable = "true";
				
				
				setTimeout(function() {
					
					var cssLink = document.createElement("link") 
		            cssLink.href = "writepub_content_editor.css"; 
		            cssLink.rel = "stylesheet"; 
		            cssLink.type = "text/css"; 
					
					$(self).contents().find('head')[0].appendChild(cssLink);
					
					$(self).contents().keydown(function(e) {
				
						if (e.ctrlKey == true) {
							
							doSomething = $('#'+id).writepub_editor_tools(String.fromCharCode(e.which).toLowerCase());
							
							if (doSomething == true) {
								e.preventDefault();
							}
						}
						
				    });
					
				},100);
				
			},100);
			
			$(window).bind('beforeunload', function(e){
				
				html = $.trim($('#' + id).contents().find('body').html());
				
	            if (html == "<br>" || html == ""){return;}
	
	            var e = e || window.event;
	            // for ie, ff
	            e.returnValue = "คุณได้พิมพ์เนื้อหาบางส่วนในหน้านี้แล้ว หากคุณออกไป เนื้อหาจะหายหมด";
	            // for webkit
	            return "คุณได้พิมพ์เนื้อหาบางส่วนในหน้านี้แล้ว หากคุณออกไป เนื้อหาจะหายหมด";             
	        }); 
			
			
		},
		writepub_editor_tools: function(key){
			
			if (key == 'b') writepub_editor.insert_bold(this[0]);
			else if (key =='i') writepub_editor.insert_italic(this[0]);
			
			else if (key == 'open_link') writepub_editor.link_dialog_box.open(this[0]);
			else if (key == 'link') writepub_editor.insert_link(this[0],arguments[1]);
			
			else if (key == 'open_image') writepub_editor.image_dialog_box.open(this[0]);
			else if (key == 'image') writepub_editor.insert_image(this[0],arguments[1],arguments[2]);
			
			else if (key == 'open_video') writepub_editor.video_dialog_box.open(this[0]);
			else if (key == 'video') writepub_editor.insert_video(this[0],arguments[1]);
			
			else return false; // it didn't do anything
			
			return true; // it did something
			
		}
		
	});
	
})(jQuery);

var writepub_editor = {};
writepub_editor.input = null;
writepub_editor.selection = null;

writepub_editor.insert_bold = function(self) {
	$(self).contents()[0].execCommand("bold",false,""); 
}

writepub_editor.insert_italic = function(self) {
	$(self).contents()[0].execCommand("italic",false,""); 
}

writepub_editor.insert_link = function(self, url) {
	
	if ($.trim(url).match(/^(https?|ftp)/i) == null) throw "An URL must start with 'http', 'https' or 'ftp";
	
	$(self).contents()[0].execCommand("CreateLink", false, url);
	$(self).contents().find('a[href="'+url+'"]').attr('title',url);
}

writepub_editor.insert_video = function(self, url) {
	
	if (url.match(/^(https?:\/\/)?(www.)?youtube.com\//) == null)
	{
		throw "Youtube's URL is invalid."
	}
	
	if ((result = url.match(/^(https?:\/\/)?(www.)?youtube.com\/watch\?(.*)v=([^&]+)/)) != null)
	{
		url = "http://www.youtube.com/embed/"+result[4];
	}
	
	video_html = '<iframe width="480" height="390" src="'+url+'" frameborder="0" allowfullscreen></iframe>'; 
	

	if ($.browser.msie) {
		// IE does not support InsertHTML command
		
		var i_document = $(self)[0].contentWindow.document;
		
		if (i_document.selection && i_document.selection.createRange) {
			var range = i_document.selection.createRange();
			if (range.pasteHTML) {
				range.pasteHTML(video_html);
			}
		}
	} else {
		$(self).contents()[0].execCommand("InsertHTML", false, video_html);
	}
}

writepub_editor.insert_image = function(self, url) {
	
	if ($.browser.msie) { 
		// Only IE has a problem with inserting multiple images at once (Problem with selection)
		// Therefore, we insert HTML directly
		
		var image_html = '<img src="' + url + '">'; 
		
		var i_document = $(self)[0].contentWindow.document;
		
		if (i_document.selection && i_document.selection.createRange) {
			var range = i_document.selection.createRange();
			if (range.pasteHTML) {
				range.pasteHTML(image_html);
			}
		}
	} else {
		$(self).contents()[0].execCommand("InsertImage", false, url);
	}

}

writepub_editor.show_dialog_box_overlay = function() {
	if ($('#writepub_editor_dialog_box_overlay').length == 0) {
		$("body").append('<div id="writepub_editor_dialog_box_overlay" class="writepub_editor_editor_overlay"></div>');
	}
}

writepub_editor.close_dialog_box = function(){
	$('#writepub_editor_dialog_box_overlay').hide();
	$('#writepub_editor_link_dialog_box').hide();
	$('#writepub_editor_video_dialog_box').hide();
	$('#writepub_editor_image_dialog_box').hide();
}
	
writepub_editor.insert_toolbar = function(self) {
	
	var id = self.id;
	$(self).before('<span class="writepub_editor_toolbar">' +
						'<input type="button" unselectable="on" class="bold_button" onclick="$(\'#'+id+'\').writepub_editor_tools(\'b\');">' +
						'<input type="button" unselectable="on" class="italic_button" onclick="$(\'#'+id+'\').writepub_editor_tools(\'i\');">' +
						'<input type="button" unselectable="on" class="link_button" onclick="$(\'#'+id+'\').writepub_editor_tools(\'open_link\');">' +
						'<input type="button" unselectable="on" class="image_button" onclick="$(\'#'+id+'\').writepub_editor_tools(\'open_image\');">' +
						'<input type="button" unselectable="on" class="vdo_button" onclick="$(\'#'+id+'\').writepub_editor_tools(\'open_video\');">' +
					'</span>');
			
}

/*
 * Link dialog box handler
 * 
 */

writepub_editor.link_dialog_box = {};
writepub_editor.link_dialog_box.open = function(input) {
	
	writepub_editor.input = input;
	
	writepub_editor.input.focus();
	writepub_editor.selection = writepub_editor.helper.save_selection(writepub_editor.input);
	writepub_editor.show_dialog_box_overlay();
	
	if ($('#writepub_editor_link_dialog_box').length == 0) {
		alert("Please define #writepub_editor_link_dialog_box");
		writepub_editor.close_dialog_box();
	}
	
	$('#writepub_editor_link_dialog_box_url').val("");
	
	$('#writepub_editor_dialog_box_overlay').show();
	$('#writepub_editor_link_dialog_box').show();
}

writepub_editor.link_dialog_box.submit = function() {
	
	var url = $('#writepub_editor_link_dialog_box_url').val();

	writepub_editor.helper.restore_selection(writepub_editor.input, writepub_editor.selection);
	
	try {
	
		writepub_editor.insert_link(writepub_editor.input, url);
		writepub_editor.close_dialog_box();
		$('#writepub_editor_link_dialog_box_error_panel').hide();
	} catch (e) {
		$('#writepub_editor_link_dialog_box_error_panel').hide();
		$('#writepub_editor_link_dialog_box_error_panel').html(e);
		$('#writepub_editor_link_dialog_box_error_panel').fadeIn();
	}
	
	
}

writepub_editor.link_dialog_box.setup = function(self) {
	
	if ($('#writepub_editor_link_dialog_box').length > 0) return;
	
	$(self).after('<div id="writepub_editor_link_dialog_box" class="writepub_editor_link_dialog_box" style="position: fixed; width: 400px; z-index: 1001; top: 50%; left: 50%; display: block; margin-top: -75.5px; margin-left: -203px;display:none;">' +
						'<div style="display:block;">'+
							'<h1>'+
								'Link'+
							'</h1>'+
							'<span class="writepub_editor_dialog_box_row">'+
								'<p>'+
									'URL:'+
								'</p>'+				
								'<input type="text" id="writepub_editor_link_dialog_box_url" class="writepub_editor_dialog_textbox_input" placeholder="URL"/><br/>'+
							'</span>'+
							'<span id="writepub_editor_link_dialog_box_error_panel" style="margin-left:30px;" class="writepub_editor_dialog_box_row" style="display:none;">'+
							'</span>'+
							'<span class="writepub_editor_dialog_box_row">'+
								'<input type="button" class="blue_button" value="Add" onclick="writepub_editor.link_dialog_box.submit();"/>'+
								'<input type="button" class="gray_button" value="Close" onclick="writepub_editor.close_dialog_box();"/>'+
							'</span>'+
						'</div>'+
					'</div>');
	
	$('#writepub_editor_link_dialog_box_url').keyup(function(event) {
		
		if (event.which==13) writepub_editor.link_dialog_box.submit();
		
	});
			
}


/*
 * Video dialog box handler
 * 
 */
writepub_editor.video_dialog_box = {};
writepub_editor.video_dialog_box.open = function(input) {
	
	writepub_editor.input = input;
	
	writepub_editor.input.focus();
	writepub_editor.selection = writepub_editor.helper.save_selection(writepub_editor.input);
	writepub_editor.show_dialog_box_overlay();
	
	if ($('#writepub_editor_video_dialog_box').length == 0) {
		alert("Please define #writepub_editor_video_dialog_box");
		writepub_editor.close_dialog_box();
	}
	
	$('#writepub_editor_video_dialog_box_url').val("");
	
	$('#writepub_editor_dialog_box_overlay').show();
	$('#writepub_editor_video_dialog_box').show();
}

writepub_editor.video_dialog_box.submit = function() {
	
	var url = $('#writepub_editor_video_dialog_box_url').val();
	
	writepub_editor.helper.restore_selection(writepub_editor.input, writepub_editor.selection);
	
	try {
		writepub_editor.insert_video(writepub_editor.input, url);
		writepub_editor.close_dialog_box();
		$('#writepub_editor_video_dialog_box_error_panel').hide();
	} catch (e) {
		$('#writepub_editor_video_dialog_box_error_panel').hide();
		$('#writepub_editor_video_dialog_box_error_panel').html(e);
		$('#writepub_editor_video_dialog_box_error_panel').fadeIn();
	}
	
}

writepub_editor.video_dialog_box.setup = function(self) {
	
	if ($('#writepub_editor_video_dialog_box').length > 0) return;
	
	$(self).after('<div id="writepub_editor_video_dialog_box" class="writepub_editor_video_dialog_box" style="position: fixed; width: 400px; z-index: 1001; top: 50%; left: 50%; display: block; margin-top: -75.5px; margin-left: -203px;display:none;">' +
						'<div style="display:block;">' +
							'<h1>' +
								'Youtube' +
							'</h1>' +
							'<span class="writepub_editor_dialog_box_row">' +
								'<p>' +
									'URL:' +
								'</p>' +
								'<input type="text" id="writepub_editor_video_dialog_box_url" class="writepub_editor_dialog_textbox_input" placeholder="URL Link"/><br/>' +
							'</span>' +
							'<span id="writepub_editor_video_dialog_box_error_panel" style="margin-left:30px;" class="writepub_editor_dialog_box_row" style="display:none;">'+
							'</span>'+
							'<span class="writepub_editor_dialog_box_row">' +
								'<input type="button" class="blue_button" value="Add" onclick="writepub_editor.video_dialog_box.submit();"/>' +
								'<input type="button" class="gray_button" value="Close" onclick="writepub_editor.close_dialog_box();"/>' +
							'</span>' +
						'</div>' +
					'</div>');

	$('#writepub_editor_video_dialog_box_url').keyup(function(event) {
		
		if (event.which==13) writepub_editor.video_dialog_box.submit();
		
	});

}

/*
 * Image dialog box handler
 * 
 */
writepub_editor.image_dialog_box = {};
writepub_editor.image_dialog_box.open = function(input) {
	
	writepub_editor.input = input;
	
	writepub_editor.input.focus();
	writepub_editor.selection = writepub_editor.helper.save_selection(writepub_editor.input);
	writepub_editor.show_dialog_box_overlay();
	
	if ($('#writepub_editor_image_dialog_box').length == 0) {
		alert("Please define #writepub_editor_image_dialog_box");
		writepub_editor.close_dialog_box();
	}
	
	$('#writepub_editor_image_dialog_box_url').val("");
	
	$('#writepub_editor_dialog_box_overlay').show();
	$('#writepub_editor_image_dialog_box').show();
}

writepub_editor.image_dialog_box.submit = function() {
	
	var url = $('#writepub_editor_image_dialog_box_url').val();
	
	t = "";
	for (var i in writepub_editor.selection) {
		t += i +"->"+writepub_editor.selection[i]+"\n";
	}
	
	alert(t);
	
	writepub_editor.helper.restore_selection(writepub_editor.input, writepub_editor.selection);
	
	try {
		
		var spans = $('#writepub_editor_image_container').children('span');
		
		for (var i=0;i<spans.length;i++) {
			if ($(spans[i]).hasClass('selected') && $(spans[i]).find('img').length > 0) {
				url = $(spans[i]).find('img')[0].src;
				writepub_editor.insert_image(writepub_editor.input, url);
				$(spans[i]).removeClass('selected');
			}
		}
		
		
		writepub_editor.close_dialog_box();
		$('#writepub_editor_image_dialog_box_error_panel').hide();
	} catch (e) {
		$('#writepub_editor_image_dialog_box_error_panel').hide();
		$('#writepub_editor_image_dialog_box_error_panel').html(e);
		$('#writepub_editor_image_dialog_box_error_panel').fadeIn();
	}
	
}
writepub_editor.image_dialog_box.setup = function(self) {
	
	if ($('#writepub_editor_image_dialog_box').length > 0) return;
	
	$(self).after('<div id="writepub_editor_image_dialog_box" class="writepub_editor_image_dialog_box" style="position: fixed; width: 430px;height:200px; z-index: 1001; top: 50%; left: 50%; display: block; margin-top: -75.5px; margin-left: -223px;display:none;">' +
						'<div style="display:block;">' +
							'<span id="writepub_editor_image_super_container" style="width: 430px;height:170px;overflow:hidden;display:block;">' +
								'<span id="writepub_editor_image_container" style="width: 430px;height:190px;overflow:scroll;display:block;">' +
								'</span>' +
							'</span>' +
							'<span id="writepub_editor_image_dialog_box_error_panel" style="display:none;">' +
							'</span>' +
							'<span class="writepub_editor_dialog_box_row">' +
								'<input id="writepub_editor_insert_image_button" class="green_button" type="button" value="Insert selected images" onclick="writepub_editor.image_dialog_box.submit();" />' +
								'<input id="writepub_editor_upload_button" class="blue_button" type="button" value="Upload File" />' +
								'<input type="button" class="gray_button" value="Close" onclick="writepub_editor.close_dialog_box();"/>' +
							'</span>' +
						'</div>' +
					'</div>');


	$("#writepub_editor_image_container").delegate(".writepub_editor_thumbnail_unit", "click", function(){
		$(this).toggleClass("selected");
	});
	
	$("#writepub_editor_image_container").delegate(".writepub_editor_thumbnail_unit", "dblclick", function(){
		$(this).addClass("selected");
		writepub_editor.image_dialog_box.submit();
	});
	
	$('#writepub_editor_upload_button').wiky_uploader({
											action:'/temporary_file/image',
											mouseover_class:"button_hover",
											mousedown_class:"button_down",
											debug:false,
											params:{
												max_width:400
											},
											onSubmit: function(fileId, fileName){
												$('#writepub_editor_image_container').prepend(
													'<span class="writepub_editor_thumbnail_unit" id="writepub_editor_thumbnail_unit_'+fileId+'">' +
														'<span class="writepub_editor_thumbnail_unit_img">' +
															'<span class="writepub_editor_thumbnail_unit_img_progress"></span>'+
														'</span>'+
														'<span class="writepub_editor_thumbnail_unit_text">'+fileName+'</span>'+
													'</span>');
											},
									        onProgress: function(fileId, fileName, loaded, total){
												
												progress_span = $('#writepub_editor_thumbnail_unit_'+fileId).find('.writepub_editor_thumbnail_unit_img_progress');
												progress_span = progress_span[0];
										
											},
									        onComplete: function(fileId, fileName, responseJSON){
												$('#writepub_editor_thumbnail_unit_'+fileId).find('.writepub_editor_thumbnail_unit_img_progress').remove();
												
												$('#writepub_editor_thumbnail_unit_'+fileId).children('.writepub_editor_thumbnail_unit_img').html('<img src="'+responseJSON.filename+'"/>');
											},
									        onCancel: function(id, fileName){
												$('#writepub_editor_thumbnail_unit_'+fileId).fadeOut(function() {$(this).remove();});
											}
										});
}


/*
 * Helpers
 */
writepub_editor.helper = {}
writepub_editor.helper.save_selection = function(iframe) {
	
	var i_window = $(iframe)[0].contentWindow;
	var i_document = $(iframe)[0].contentWindow.document;
	
    if (i_window.getSelection) {
        sel = i_window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            var ranges = [];
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
    } else if (i_document.selection && i_document.selection.createRange) {
        return i_document.selection.createRange();
    }
    return null;
}

writepub_editor.helper.restore_selection = function(iframe, savedSel) {
	
	var i_window = $(iframe)[0].contentWindow;
	var i_document = $(iframe)[0].contentWindow.document;

    if (savedSel) {
        if (i_window.getSelection) {
            sel = i_window.getSelection();
            sel.removeAllRanges();
            for (var i = 0, len = savedSel.length; i < len; ++i) {
                sel.addRange(savedSel[i]);
            }
        } else if (i_document.selection && savedSel.select) {
            savedSel.select();
        }
    }
}
