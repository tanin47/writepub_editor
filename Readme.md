Writepub Editor
===================

Writepub Editor is a WYSIWYG editor that can be used on a website.
It is originally built for my website, writepub.com, which is never launched.

Writepub Editor offers only very limited styling. 
It is ideal for a website for mass.

It supports:
* Bold and Italic fonts
* Uploading images
* Adding links
* Adding Youtube's video

You can see [the demo here](http://tanin.nanakorn.com/writepub_editor).


How to use it
----------------

First of all, you should include these files:

```
<script type="text/javascript" src="jquery-1.6.2.min.js"></script>
<script type="text/javascript" src="jquery-draggable.min.js"></script>
<script type="text/javascript" src="wiky_uploader.js"></script>
<script type="text/javascript" src="writepub_editor.js"></script>
<link type="text/css" href="writepub_editor.css" rel="stylesheet">
```

Now you can initialize a textarea:

```javascript
$('#editor2').writepub_editor({
								temporary_image_path: "/temporary_file/image",
								on_leave_message:"If you leave, your content will be gone.",
								css_path:"writepub_content_editor.css"
								});
```

__css_path__ is to style the content inside Writepub Editor.

__temporary_image_path__ is the path that accepts image uploading and it should return a JSON messages:

{:ok=>true, :filename=>filename}
      
OR

{:ok=>false, :error_messages=>"The format is not allowed."}


Author
-----------
Tanin Na Nakorn