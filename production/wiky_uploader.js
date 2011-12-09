(function(a){a.fn.extend({wiky_uploader_tools:function(){var b=this[0];return{cancel:function(c){b._wiky_uploader._handler.cancel(c)}}},wiky_uploader:function(b){default_options={params:{},name:"Filedata",prefixId:"AjaxUploadButton",action:"/",multiple:true,debug:false,allowedExtensions:[],sizeLimit:0,minSizeLimit:0,mousedown_class:"",mouseover_class:"",disabled_class:"",onSubmit:function(d,c){},onProgress:function(f,e,c,d){},onComplete:function(e,d,c){},onCancel:function(d,c){},messages:{typeError:"{file} has invalid extension. Only {extensions} are allowed.",sizeError:"{file} is too large, maximum file size is {sizeLimit}.",minSizeError:"{file} is too small, minimum file size is {minSizeLimit}.",emptyError:"{file} is empty, please select files again without it.",onLeave:"The files are being uploaded, if you leave now the upload will be cancelled."},showMessage:function(c){alert(c)},maxConnections:3};a.extend(default_options,b);this[0]._wiky_uploader=new wiky_uploader(this[0],default_options)}})})(jQuery);wiky_uploader_helper={};wiky_uploader_helper.getUniqueId=(function(){var a=0;return function(){return a++}})();wiky_uploader_helper.toElement=(function(){var a=document.createElement("div");return function(b){a.innerHTML=b;var c=a.firstChild;return a.removeChild(c)}})();wiky_uploader_helper.copyLayout=function(c,b){var a=wiky_uploader_helper.getBox(c);$(b).css({position:"absolute",left:a.left+"px",top:a.top+"px",width:c.offsetWidth+"px",height:c.offsetHeight+"px"})};wiky_uploader_helper.getBox=function(c){var e,b,d,a;var f=$(c).offset();e=f.left;d=f.top;b=e+c.offsetWidth;a=d+c.offsetHeight;return{left:e,right:b,top:d,bottom:a}};wiky_uploader_helper.indexOf=function(b,c,d){if(b.indexOf){return b.indexOf(c,d)}d=d||0;var a=b.length;if(d<0){d+=a}for(;d<a;d++){if(d in b&&b[d]===c){return d}}return -1};wiky_uploader_helper.obj2url=function(f,b,h){var g=[],d="&",e=function(k,j){var l=b?(/\[\]$/.test(b))?b:b+"["+j+"]":j;if((l!="undefined")&&(j!="undefined")){g.push((typeof k==="object")?wiky_uploader_helper.obj2url(k,l,true):(Object.prototype.toString.call(k)==="[object Function]")?encodeURIComponent(l)+"="+encodeURIComponent(k()):encodeURIComponent(l)+"="+encodeURIComponent(k))}};if(!h&&b){d=(/\?/.test(b))?(/\?$/.test(b))?"":"&":"?";g.push(b);g.push(wiky_uploader_helper.obj2url(f))}else{if((Object.prototype.toString.call(f)==="[object Array]")&&(typeof f!="undefined")){for(var c=0,a=f.length;c<a;++c){e(f[c],c)}}else{if((typeof f!="undefined")&&(f!==null)&&(typeof f==="object")){for(var c in f){e(f[c],c)}}else{g.push(encodeURIComponent(b)+"="+encodeURIComponent(f))}}}return g.join(d).replace(/^&/,"").replace(/%20/g,"+")};wiky_uploader=function(b,a){this._options=a;this._filesInProgress=0;this._handler=this._createUploadHandler();this._preventLeaveInProgress();this._button=b;this._rerouteClicks();this._input=this._createInput()};wiky_uploader.prototype={_createUploadHandler:function(){var a=this,c;if(qq.UploadHandlerXhr.isSupported()){c="UploadHandlerXhr"}else{c="UploadHandlerForm"}var b=new qq[c]({debug:this._options.debug,action:this._options.action,name:this._options.name,maxConnections:this._options.maxConnections,onProgress:function(g,f,d,e){a._onProgress(g,f,d,e);a._options.onProgress(g,f,d,e)},onComplete:function(f,e,d){a._onComplete(f,e,d);a._options.onComplete(f,e,d)},onCancel:function(e,d){a._onCancel(e,d);a._options.onCancel(e,d)}});return b},_preventLeaveInProgress:function(){var a=this;$(window).bind("beforeunload",function(b){if(a._filesInProgress==0){return}var b=b||window.event;b.returnValue=a._options.messages.onLeave;return a._options.messages.onLeave})},_rerouteClicks:function(){var a=this;$(a._button).mouseover(function(){if(!a._input){a._createInput()}var b=a._input.parentNode;wiky_uploader_helper.copyLayout(a._button,b);b.style.visibility="visible"})},reset:function(){if(this._input.parentNode){$(this._input.parentNode).remove()}$(this._button).removeClass(this._options.mouseover_class);$(this._button).removeClass(this._options.mousedown_class);this._input=this._createInput()},_createInput:function(){var b=this;var a=document.createElement("input");a.setAttribute("type","file");a.setAttribute("name",b._options.name);a.setAttribute("id",b._options.prefixId+"_"+b._button.id);if(b._options.multiple==true){a.setAttribute("multiple","multiple")}$(a).css({position:"absolute",right:0,margin:0,padding:0,fontSize:"480px",cursor:"pointer"});var c=document.createElement("div");$(c).css({display:"block",position:"absolute",overflow:"hidden",margin:0,padding:0,opacity:0,direction:"ltr",zIndex:2000000000});$(a).addClass("wiky_uploader_button");$(a).bind("change",function(){if(b._handler instanceof qq.UploadHandlerXhr){b._uploadFileList(a.files)}else{if(b._validateFile(a)){b._uploadFile(a)}}b.reset()});$(a).mouseover(function(){$(b._button).addClass(b._options.mouseover_class)});$(a).mousedown(function(){$(b._button).addClass(b._options.mousedown_class)});$(a).mouseup(function(){$(b._button).removeClass(b._options.mousedown_class)});$(a).mouseout(function(){$(b._button).removeClass(b._options.mouseover_class);$(b._button).removeClass(b._options.mousedown_class);a.parentNode.style.visibility="hidden"});c.appendChild(a);document.body.appendChild(c);return a},setParams:function(a){$.extend(this._options.params,a)},getInProgress:function(){return this._filesInProgress},_onSubmit:function(b,a){this._filesInProgress++},_onProgress:function(d,c,a,b){},_onComplete:function(c,b,a){this._filesInProgress--;if(a.error){this._options.showMessage(a.error)}},_onCancel:function(b,a){this._filesInProgress--},_onInputChange:function(a){if(this._handler instanceof qq.UploadHandlerXhr){this._uploadFileList(a.files)}else{if(this._validateFile(a)){this._uploadFile(a)}}this._button.reset()},_uploadFileList:function(b){for(var a=0;a<b.length;a++){if(!this._validateFile(b[a])){return}}for(var a=0;a<b.length;a++){this._uploadFile(b[a])}},_uploadFile:function(a){var c=this._handler.add(a);var b=this._handler.getName(c);if(this._options.onSubmit(c,b)!==false){this._onSubmit(c,b);this._handler.upload(c,this._options.params)}},_validateFile:function(c){var a,b;if(c.value){a=c.value.replace(/.*(\/|\\)/,"")}else{a=c.fileName!=null?c.fileName:c.name;b=c.fileSize!=null?c.fileSize:c.size}if(!this._isAllowedExtension(a)){this._error("typeError",a);return false}else{if(b===0){this._error("emptyError",a);return false}else{if(b&&this._options.sizeLimit&&b>this._options.sizeLimit){this._error("sizeError",a);return false}else{if(b&&b<this._options.minSizeLimit){this._error("minSizeError",a);return false}}}}return true},_error:function(c,d){var b=this._options.messages[c];function a(e,f){b=b.replace(e,f)}a("{file}",this._formatFileName(d));a("{extensions}",this._options.allowedExtensions.join(", "));a("{sizeLimit}",this._formatSize(this._options.sizeLimit));a("{minSizeLimit}",this._formatSize(this._options.minSizeLimit));this._options.showMessage(b)},_formatFileName:function(a){if(a.length>33){a=a.slice(0,19)+"..."+a.slice(-13)}return a},_isAllowedExtension:function(d){var b=(-1!==d.indexOf("."))?d.replace(/.*[.]/,"").toLowerCase():"";var c=this._options.allowedExtensions;if(!c.length){return true}for(var a=0;a<c.length;a++){if(c[a].toLowerCase()==b){return true}}return false},_formatSize:function(a){var b=-1;do{a=a/1024;b++}while(a>99);return Math.max(a,0.1).toFixed(1)+["kB","MB","GB","TB","PB","EB"][b]}};qq={};qq.UploadHandlerAbstract=function(a){this._options={debug:false,action:"/upload.php",name:"qqfile",maxConnections:999,onProgress:function(e,d,b,c){},onComplete:function(d,c,b){},onCancel:function(c,b){}};$.extend(this._options,a);this._queue=[];this._params=[]};qq.UploadHandlerAbstract.prototype={log:function(a){if(this._options.debug&&window.console){console.log("[uploader] "+a)}},add:function(a){},upload:function(d,b){var a=this._queue.push(d);var c={};$.extend(c,b);this._params[d]=c;if(a<=this._options.maxConnections){this._upload(d,this._params[d])}},cancel:function(a){this._cancel(a);this._dequeue(a)},cancelAll:function(){for(var a=0;a<this._queue.length;a++){this._cancel(this._queue[a])}this._queue=[]},getName:function(a){},getSize:function(a){},getQueue:function(){return this._queue},_upload:function(a){},_cancel:function(a){},_dequeue:function(d){var b=wiky_uploader_helper.indexOf(this._queue,d);this._queue.splice(b,1);var a=this._options.maxConnections;if(this._queue.length>=a&&b<a){var c=this._queue[a-1];this._upload(c,this._params[c])}}};qq.UploadHandlerForm=function(a){qq.UploadHandlerAbstract.apply(this,arguments);this._inputs={}};$.extend(qq.UploadHandlerForm.prototype,qq.UploadHandlerAbstract.prototype);$.extend(qq.UploadHandlerForm.prototype,{add:function(a){a.setAttribute("name","qqfile");var b="qq-upload-handler-iframe"+wiky_uploader_helper.getUniqueId();this._inputs[b]=a;if(a.parentNode){$(a).remove()}return b},getName:function(a){return this._inputs[a].value.replace(/.*(\/|\\)/,"")},_cancel:function(b){this._options.onCancel(b,this.getName(b));delete this._inputs[b];var a=document.getElementById(b);if(a){a.setAttribute("src","javascript:false;");$(a).remove()}},_upload:function(g,e){var b=this._inputs[g];if(!b){throw new Error("file with passed id was not added, or already uploaded or cancelled")}var a=this;if(location.href.match(/^file:\/\//)!=null){response={filename:"test_upload_picture.jpg"};a._options.onComplete(g,f,response);a._dequeue(g);delete a._inputs[g];return}var f=this.getName(g);var c=this._createIframe(g);var d=this._createForm(c,e);d.appendChild(b);this._attachLoadEvent(c,function(){a.log("iframe loaded");var h=a._getIframeContentJSON(c);a._options.onComplete(g,f,h);a._dequeue(g);delete a._inputs[g];setTimeout(function(){$(c).remove()},1)});d.submit();$(d).remove();return g},_attachLoadEvent:function(a,b){$(a).bind("load",function(){if(!a.parentNode){return}var c=false;if(a.contentDocument){c=a.contentDocument}else{if(a.contentWindow){c=a.contentWindow.document}}if(c&&c.body&&c.body.innerHTML=="false"){return}b()})},_getIframeContentJSON:function(iframe){var doc=iframe.contentDocument?iframe.contentDocument:iframe.contentWindow.document,response;this.log("converting iframe's innerHTML to JSON");this.log("innerHTML = "+doc.body.innerHTML);try{response=eval("("+doc.body.innerHTML+")")}catch(err){response={}}return response},_createIframe:function(b){var a=wiky_uploader_helper.toElement('<iframe src="javascript:false;" name="'+b+'" />');a.setAttribute("id",b);a.style.display="none";document.body.appendChild(a);return a},_createForm:function(a,c){var b=wiky_uploader_helper.toElement('<form method="post" enctype="multipart/form-data"></form>');var d=wiky_uploader_helper.obj2url(c,this._options.action);b.setAttribute("action",d);b.setAttribute("target",a.name);b.style.display="none";document.body.appendChild(b);return b}});qq.UploadHandlerXhr=function(a){qq.UploadHandlerAbstract.apply(this,arguments);this._files=[];this._xhrs=[];this._loaded=[]};qq.UploadHandlerXhr.isSupported=function(){var a=document.createElement("input");a.type="file";return("multiple" in a&&typeof File!="undefined"&&typeof(new XMLHttpRequest()).upload!="undefined")};$.extend(qq.UploadHandlerXhr.prototype,qq.UploadHandlerAbstract.prototype);$.extend(qq.UploadHandlerXhr.prototype,{add:function(a){if(!(a instanceof File)){throw new Error("Passed obj in not a File (in qq.UploadHandlerXhr)")}return this._files.push(a)-1},getName:function(b){var a=this._files[b];return a.fileName!=null?a.fileName:a.name},getSize:function(b){var a=this._files[b];return a.fileSize!=null?a.fileSize:a.size},getLoaded:function(a){return this._loaded[a]||0},_upload:function(h,f){var d=this._files[h],b=this.getName(h),c=this.getSize(h);this._loaded[h]=0;var e=this._xhrs[h]=new XMLHttpRequest();var a=this;e.upload.onprogress=function(i){if(i.lengthComputable){a._loaded[h]=i.loaded;a._options.onProgress(h,b,i.loaded,i.total)}};e.onreadystatechange=function(){if(e.readyState==4){a._onComplete(h,e)}};if(location.href.match(/^file:\/\//)!=null){e={status:200,responseText:'{filename:"test_upload_picture.jpg"}'};a._onComplete(h,e);return}f=f||{};f[this._options.name]=b;var g=wiky_uploader_helper.obj2url(f,this._options.action);e.open("POST",g,true);e.setRequestHeader("X-Requested-With","XMLHttpRequest");e.setRequestHeader("X-File-Name",encodeURIComponent(b));e.setRequestHeader("Content-Type","application/octet-stream");e.send(d)},_onComplete:function(id,xhr){if(!this._files[id]){return}var name=this.getName(id);var size=this.getSize(id);this._options.onProgress(id,name,size,size);if(xhr.status==200){this.log("xhr - server response received");this.log("responseText = "+xhr.responseText);var response;try{response=eval("("+xhr.responseText+")")}catch(err){response={}}this._options.onComplete(id,name,response)}else{this._options.onComplete(id,name,{})}this._files[id]=null;this._xhrs[id]=null;this._dequeue(id)},_cancel:function(a){this._options.onCancel(a,this.getName(a));this._files[a]=null;if(this._xhrs[a]){this._xhrs[a].abort();this._xhrs[a]=null}}});