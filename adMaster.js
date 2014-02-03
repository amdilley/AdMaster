var AdMaster = (function() {
	var frames = top.document.getElementsByTagName('iframe'),
		thisFrame;

	for(var i = 0, l = frames.length; i < l; i++){
		if(frames[i].contentWindow == self){
			thisFrame = frames[i];
			break;
		}
	}

	/*** impression and research metrics ***/
	function addImp(url) {
		(new Image()).src = url;
	}
	function addJS(url) {
		var s = document.createElement('script');
		s.type= 'text/javascript';
		s.src = url;
		s.setAttribute('class', 'gpt-rich-media-content');

		return s;
	}

	/*** template builder functions ***/
	function hasFlash() {
		return !!(navigator.mimeTypes["application/x-shockwave-flash"] || window.ActiveXObject && new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
	}
	function cachebuster() {
		return Math.floor(1000000000 * Math.random());
	}
	function getFlashVars(cts) {
			var ct_keys = ['clicktag', 'clickTag', 'clickTAG', 'ClickTag', 'ClickTAG']; // array of clicktag Flash paramters
			var fv = []; // flashvar parameter output

			for(var i = 0, l = cts.length; i < l; ++i) {
				for(var j = 0, m = ct_keys.length; j < m; ++j) {
					fv.push(ct_keys[j] + '=' + cts[i]);
				}
			}

			return escape(fv.join('&'));
	}
	function getEmbed(width, height, flash, backup_image, clicktags, r, target) {
		if(hasFlash() && !!flash) {
			var fv = getFlashVars(clicktags);
			var object = '<object width="' + width + '" height="' + height + '">' +
				'	<param name="movie" value="' + flash + '">' +
				'	<param name="flashvars" value="' + fv + '">' +
				'	<param name="quality" value="high">' +
				'	<param name="wmode" value="transparent">' +
				'	<param name="AllowScriptAccess" value="always">' +
				'	<embed src="' + flash + '" flashvars="' + fv + '" width="' + width + '" height="' + height + '" type="application/x-shockwave-flash" quality="high" swliveconnect="true" wmode="transparent" name="flash_' + this.r + '" allowscriptaccess="always">' +
				'</object>';	
		} else {
			var object = '<a href="' + clicktags[0] + '" target="' + (target ? target : '_blank') + '">' +
				'	<img src="' + backup_image + '" width="' + width + '" height="' + height + '" alt="Advertisement">' +
				'</a>';
		}

		return object;
	}
	function getCookieLoader(r) {
		return 'var cookie_' + r + ' = (function() {' +
			'	return {' +
			'		create: function(name, value, days) {' +
			'			var d = new Date();' +
			'			if(days == "eod") {' +
			'				d.setDate(d.getDate() + 1);' +
			'				d.setHours(0);' +
			'				d.setMinutes(0);' +
			'				d.setSeconds(0);' +
			'				d.setMilliseconds(0);' +
			'				value += ";expires=" + d.toGMTString();' +
			'			} else if(days) {' +
			'				d.setTime(d.getTime() + days*24*60*60*1000);' +
			'				value += ";expires=" + d.toGMTString();' +
			'			}' +
			'			document.cookie = name + "=" + value + ";path=/";' +
			'		},' +
			'		read: function(name) {' +
			'			var ca = document.cookie.split(";");' +
			'			for(var i = 0, l = ca.length; i < l; i++) {' +
			'				if(ca[i].split("=")[0].replace(/\\s/g, "") == name) {' +
			'					return ca[i].split("=")[1];' +
			'				}' +
			'			}' +
			'		},' +
			'		erase: function(name) {' +
			'			this.create(name, "", -1);' +
			'		}' +
			'	};' +
			'})();';
	}

	return {
		cachebuster: cachebuster,
		getEmbed: getEmbed,
		getCookieLoader: getCookieLoader,
		load: function(template, imps, js) {
			if(template.delivery == 'RM' && top != self) {
				var h, c, s;

				if(template.css) {
					c = top.document.createElement('style');
					c.setAttribute('class', 'gpt-rich-media-content');
					c.setAttribute('type', 'text/css');
					if(c.styleSheet && !c.sheet) {
						c.styleSheet.cssText = template.css;
					} else {
						c.appendChild(top.document.createTextNode(template.css));
					}
					top.document.getElementsByTagName('head')[0].appendChild(c);
				}

				if(template.html) {
					h = top.document.createElement('span');
					h.setAttribute('class', 'gpt-rich-media-content');
					h.style.display = 'inline-block';
					h.style.width = '100%';
					thisFrame.parentNode.insertBefore(h, thisFrame);
					h.innerHTML = template.html;
				}

				if(template.js) {
					s = top.document.createElement('script');
					s.setAttribute('class', 'gpt-rich-media-content');
					s.text = template.js;
					s.setAttribute('type', 'text/javascript');
					thisFrame.parentNode.insertBefore(s, thisFrame.nextSibling);
				}

				for(var i = 0, l = js.length; i < l; i++){
					if(js[i]) thisFrame.parentNode.insertBefore(addJS(js[i]), thisFrame.nextSibling);
				}

				thisFrame.style.display = 'none';
			} else {
				var adBody = (template.css ? '<style type="text/css">' + template.css + '</style>' : '') + 
					(template.html ? '<span style="display:inline-block;">' + template.html + '</span>' : '') + 
					(template.js ? '<script type="text/javascript">' + template.js + '</scr'+'ipt>' : '');

				if(top != self) {
					for(var i = 0, l = js.length; i < l; i++){
						if(js[i]) thisFrame.parentNode.insertBefore(addJS(js[i]), thisFrame.nextSibling);
					}
				} else {
					for(var i = 0, l = js.length; i < l; i++){
						if(js[i]) adBody += '<script type="text/javascript" src="' + js[i] + '"></scr'+'ipt>';
					}
				}

				document.write(adBody);
			}

			for(var i = 0, l = imps.length; i < l; i++){
				if(imps[i]) addImp(imps[i]);
			}
		}
	};
})();

/*** Templates ***/

var TAS_Adhesion = function(o) {
	this.delivery = 'RM';
	this.adtype = 'Expandable';
	this.ae = o.adhesionEdge; // determines which edge of the screen an adhesion ad will stick to
	this.cw = o.collapsedWidth;
	this.ch = o.collapsedHeight;
	this.ew = o.expandedWidth;
	this.eh = o.expandedHeight;
	this.ci = o.collapsedImage;
	this.ei = o.expandedImage;
	this.ct = o.clickThroughUrl;
	this.r = AdMaster.cachebuster();

	/*** custom open/close text/button details ***/
	this.btn = 'http://a.dolimg.com/ads/close-button.png';

	this.css = '#basil-ad-' + this.r + ' {' +
		'	position: fixed;' +
		'	' + this.ae + ': 0;' +
		'	left: 50%;' +
		'	margin-left: -' + this.cw/2 + 'px;' +
		'	z-index: 1000000000;' +
		'}' +
		'#collapsed-' + this.r + ' {' +
		'	width: ' + this.cw + 'px;' +
		'	height: ' +this.ch + 'px;' +
		'}' + 
		'#expanded-wrapper-' + this.r + ' {' +
		'	position: fixed;' +
		'	left: 50%;' +
		'	margin-left: -' + this.ew/2 + 'px;' +
		'	z-index: 1000000001;' +
		'	-webkit-transition-duration: 300ms;' +
		'	-moz-transition-duration: 300ms;' +
		'	-ms-transition-duration: 300ms;' +
		'}' +
		'#expanded-' + this.r + ' {' +
		'	width: ' + this.ew + 'px;' +
		'	height: ' + this.eh + 'px;' +
		'}' +
		'#close-' + this.r + ' {' +
		'	position: absolute;' +
		'	top: 5px;' +
		'	right: 5px;' +
		'	width: 30px;' +
		'	height: 30px;' +
		'	z-index: 1;' +
		'}' +
		'.show-expanded-' + this.r + ' {' +
		'	' + this.ae + ': 0;' +
		'}' +
		'.hide-expanded-' + this.r + ' {' +
		'	' + this.ae + ': -' + this.eh + ';' +
		'}';

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '">' +
		'	<img src="' + this.ci + '" id="collapsed-' + this.r + '" onclick="expand_banner();">' +
		'</div>';

	this.js = 'function expand_banner() {' +
		'	document.getElementById("expanded-wrapper-' + this.r + '").className = "show-expanded-' + this.r + '";' +
		'}' +
		'function close_banner() {' +
		'	document.getElementById("expanded-wrapper-' + this.r + '").className = "hide-expanded-' + this.r + '";' +
		'}' +
		'function init_' + this.r + '() {' +
		'	var wrap = document.createElement("div"),' +
		'		a = document.createElement("a"),' +
		'		expand = document.createElement("img"),' +
		'		close = document.createElement("img");' +
		'	a.setAttribute("href", "' + this.ct + '");' +
		'	a.setAttribute("target", "_blank");' +
		'	expand.src = "' + this.ei + '";' +
		'	close.src = "' + this.btn + '";' +
		'	wrap.id = "expanded-wrapper-' + this.r + '";' +
		'	expand.id = "expanded-' + this.r + '";' +
		'	close.id = "close-' + this.r + '";' +
		'	wrap.className = "hide-expanded-' + this.r + '";' +
		' 	close.addEventListener("click", close_banner, false);' +
		'	a.appendChild(expand);' +
		'	wrap.appendChild(a);' +
		'	wrap.appendChild(close);' +
		'	document.body.appendChild(wrap);' +
		'	document.body.appendChild(document.getElementById("basil-ad-' + this.r + '"));' +
		'}' +
		'setTimeout(init_' + this.r + ', 250);';
};

var TAS_Billboard = function(o) {
	this.delivery = 'RM';
	this.adtype = 'Billboard';
	this.w = o.width;
	this.h = o.height;
	this.fl = o.flash;
	this.bi = o.backupImage;
	this.cts = o.clicktags; // array of clicktag URL strings
	this.r = AdMaster.cachebuster();

	/*** custom open/close text/button details ***/
	this.ot = 'Show Ad'; // prompt to open billboard
	this.ct = 'Close Ad'; // prompt to close billboard
	this.oc = o.openTextColor || '#444';
	this.cc = o.closeTextColor || '#444';
	this.odt = o.customOpen ? 'none' : 'block';
	this.cdt = o.customClose == 'Yes' ? 'none' : 'block';
	this.down = o.customOpen || 'http://a.dolimg.com/ads/down_arrow.png';
	this.up = 'http://a.dolimg.com/ads/up_arrow.png';
	this.obw = o.customOpenWidth || 20;
	this.obh = o.customOpenHeight || 20;

	this.embed = AdMaster.getEmbed(this.w, this.h, this.fl, this.bi, this.cts, this.r);

	this.css = '#basil-ad-' + this.r + ' {' +
		'	position: relative;' +
		'	z-index: 1000000000;' + 
		'	display:none;' +
		'}' +
		'#open-text-' + this.r + ', #close-text-' + this.r + ' {' +
		'	position: absolute;' +
		'	top: 0;' +
		'	right: 25px;' +
		'	margin: 5px;' +
		'	font-family: Helvetica, Arial, sans-serif;' +
		'	font-size: 14px;' +
		'	line-height: 20px;' +
		'	cursor: pointer;' +
		'}' +
		'#open-text-' + this.r + ':hover, #close-text-' + this.r + ':hover {' +
		'	text-decoration: underline;' +
		'}' +
		'#open-text-' + this.r + ' {' +
		'	color: ' + this.oc + ';' +
		'	display: ' + this.odt + ';' +
		'}' +
		'#close-text-' + this.r + ' {' +
		'	color: ' + this.cc + ';' +
		'	display: none;' +
		'}' +
		'#open-button-' + this.r + ', #close-button-' + this.r + ' {' +
		'	position: absolute;' +
		'	top: 0;' +
		'	right: 0;' +
		'	margin: 5px;' +
		'	cursor: pointer;' +
		'}' +
		'#open-button-' + this.r + ' {' +
		'	width: ' + this.obw + 'px;' +
		'	height: ' + this.obh + 'px;' +
		'}' +
		'#close-button-' + this.r + ' {' +
		'	width: 20px;' +
		'	height: 20px;' +
		'	display: none;' +
		'}';

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '">' +
		'	<div id="open-text-' + this.r + '" onclick="open_billboard();">' + this.ot + '</div>' +
		'	<div id="close-text-' + this.r + '" onclick="close_billboard();">' + this.ct + '</div>' +
		'	<img src="' + this.down + '" id="open-button-' + this.r + '" onclick="open_billboard();">' +
		'	<img src="' + this.up + '" id="close-button-' + this.r + '" onclick="close_billboard();">' +
		'	<div id="billboard-' + this.r + '" style="display:none;">' +
		'		' + this.embed +
		'	</div>' +
		'</div>';

	this.cookie = AdMaster.getCookieLoader(this.r);

	this.js = this.cookie + 
		'function open_billboard() {' +
		'	document.getElementById("open-button-' + this.r + '").style.display = "none";' +
		'	document.getElementById("close-button-' + this.r + '").style.display = "' + this.cdt + '";' +
		'	document.getElementById("open-text-' + this.r + '").style.display = "none";' +
		'	document.getElementById("close-text-' + this.r + '").style.display = "' + this.cdt + '";' +
		'	document.getElementById("basil-ad-' + this.r + '").style.width = "' + this.w + 'px";' +
		'	document.getElementById("basil-ad-' + this.r + '").style.height = "' + this.h + 'px";' +
		'	document.getElementById("billboard-' + this.r + '").style.display = "block";' +
		'	cookie_' + this.r + '.erase("disney_site_visit");' +
		'}' +
		'function close_billboard() {' +
		'	document.getElementById("open-button-' + this.r + '").style.display = "block";' +
		'	document.getElementById("close-button-' + this.r + '").style.display = "none";' +
		'	document.getElementById("open-text-' + this.r + '").style.display = "' + this.odt + '";' +
		'	document.getElementById("close-text-' + this.r + '").style.display = "none";' +
		'	document.getElementById("basil-ad-' + this.r + '").style.height = "' + (this.obh + 10) + 'px";' +
		'	document.getElementById("billboard-' + this.r + '").style.display = "none";' +
		'	cookie_' + this.r + '.create("disney_site_visit", "true", "eod");' +
		'}' +
		'function init_' + this.r + '() {' +
		'	document.getElementById("basil-ad-' + this.r + '").style.width = "' + this.w + 'px";' +
		'	document.getElementById("basil-ad-' + this.r + '").style.height = "' + (this.obh + 10) + 'px";' +
		'	document.getElementById("basil-ad-' + this.r + '").style.display = "inline-block";' +
		'	if(cookie_' + this.r + '.read("disney_site_visit") == undefined) open_billboard();' +
		'}' +
		'setTimeout(init_' + this.r + ', 250);';
};

var TAS_Custom = function(o) {
	this.delivery = o.delivery;
	this.adtype = o.adtype;
	this.c = document.getElementById(o.cssElementId).textContent || document.getElementById(o.cssElementId).innerText;
	this.h = document.getElementById(o.htmlElementId).textContent || document.getElementById(o.htmlElementId).innerText;
	this.j = document.getElementById(o.jsElementId).textContent || document.getElementById(o.jsElementId).innerText;
	this.r = AdMaster.cachebuster();

	this.css = this.c.replace(/%%r%%/g, this.r);

	this.html = this.h.replace(/%%r%%/g, this.r);

	this.js = this.j.replace(/%%r%%/g, this.r);
};

var TAS_Flex = function(o) {
	this.delivery = 'RM';
	this.adtype = 'Flex Static';
	this.b1 = o.base_320x50;
	this.b2 = o.base_768x66;
	this.bg1 = o.bg_480x480;
	this.bg2 = o.bg_800x800;
	this.bg3 = o.bg_1024x1024;
	this.bg4 = o.bg_1280x1280;
	this.i1 = o.img_320x320;
	this.i2 = o.img_480x480;
	this.i3 = o.img_600x600;
	this.i4 = o.img_768x768;
	this.ct = o.clickThroughUrl;
	this.r = AdMaster.cachebuster();

	/*** custom open/close text/button details ***/
	this.btn = 'http://a.dolimg.com/ads/close-button.png';

	this.css = '#basil-ad-' + this.r + ' img {' +
		'	border: none;' +
		'	box-shadow: none;' +
		'	outline: none;' +
		'	display: none;' +
		'}' +
		'#close-' + this.r + ' {' +
		'	position: fixed;' +
		'	top: 5px;' +
		'	right: 5px;' +
		'	width: 30px;' +
		'	height: 30px;' +
		'	z-index: 2000000001;' +
		'}' +
		'#bg-' + this.r + ', #img-' + this.r + ' {' +
		'	position: fixed;' +
		'	top: 50%;' +
		'	left: 50%;' +
		'}' +
		'#bg-' + this.r + ' {' +
		'	z-index: 1000000000;' +
		'}' +
		'#img-' + this.r + ', .base-' + this.r + ' {' +
		'	z-index: 2000000000;' +
		'}' +
		'.base-' + this.r + ' {' +
		'	position: fixed;' +
		'	bottom: 0;' +
		'	width: 100%;' +
		'	text-align: center;' +
		'	background: rgba(0,0,0,0.7);' +
		'	opacity: 1;' +
		'	-webkit-transition-duration: 300ms;' +
		'	-moz-transition-duration: 300ms;' +
		'	-ms-transition-duration: 300ms;' +
		'}' +
		'.hide-handset-' + this.r + ' {' +
		'	bottom: -50px;' +
		'	opacity: 0;' +
		'	-webkit-transition-duration: 300ms;' +
		'	-moz-transition-duration: 300ms;' +
		'	-ms-transition-duration: 300ms;' +
		'}' +
		'.hide-tablet-' + this.r + ' {' +
		'	bottom: -66px;' +
		'	opacity: 0;' +
		'	-webkit-transition-duration: 300ms;' +
		'	-moz-transition-duration: 300ms;' +
		'	-ms-transition-duration: 300ms;' +
		'}' +
		'/*** Smartphone ***/' +
		'.smartphone-bg-' + this.r + ' {' +
		'	margin-top: -240px;' +
		'	margin-left: -240px;' +
		'	width: 480px;' +
		'	height: 480px;' +
		'	max-width: 480px;' +
		'	max-height: 480px;' +
		'}' +
		'.smartphone-box-' + this.r + ' {' +
		'	margin-top: -160px;' +
		'	margin-left: -160px;' +
		'	width: 320px;' +
		'	height: 320px;' +
		'}' +
		'/*** Tweener ***/' +
		'.tweener-bg-' + this.r + ' {' +
		'	margin-top: -400px;' +
		'	margin-left: -400px;' +
		'	width: 800px;' +
		'	height: 800px;' +
		'	max-width: 800px;' +
		'	max-height: 800px;' +
		'}' +
		'.tweener-box-' + this.r + ' {' +
		'	margin-top: -240px;' +
		'	margin-left: -240px;' +
		'	width: 480px;' +
		'	height: 480px;' +
		'}' +
		'/*** Tablet ***/' +
		'.tablet-bg-' + this.r + ' {' +
		'	margin-top: -512px;' +
		'	margin-left: -512px;' +
		'	width: 1024px;' +
		'	height: 1024px;' +
		'	max-width: 1024px;' +
		'	max-height: 1024px;' +
		'}' +
		'.tablet-box-' + this.r + ' {' +
		'	margin-top: -300px;' +
		'	margin-left: -300px;' +
		'	width: 600px;' +
		'	height: 600px;' +
		'}' +
		'/*** Desktop ***/' +
		'.desktop-bg-' + this.r + ' {' +
		'	margin-top: -640px;' +
		'	margin-left: -640px;' +
		'	width: 1280px;' +
		'	height: 1280px;' +
		'	max-width: 1280px;' +
		'	max-height: 1280px;' +
		'}' +
		'.desktop-box-' + this.r + ' {' +
		'	margin-top: -384px;' +
		'	margin-left: -384px;' +
		'	width: 768px;' +
		'	height: 768px;' +
		'}' +
		'.fade-in-' + this.r + ' {' +
		'	opacity: 1;' +
		'	-webkit-transition-duration: 300ms;' +
		'	-moz-transition-duration: 300ms;' +
		'	-ms-transition-duration: 300ms;' +
		'}' +
		'.fade-out-' + this.r + ' {' +
		'	opacity: 0;' +
		'	-webkit-transition-duration: 300ms;' +
		'	-moz-transition-duration: 300ms;' +
		'	-ms-transition-duration: 300ms;' +
		'}';

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '">' +
		'	<div class="base-' + this.r + '">' +
		'		<img id="base-img-' + this.r + '" alt="Advertisement" onclick="flex-' + this.r + '.show();">' +
		'	</div>' +
		'	<img id="bg-' + this.r + '" alt="Advertisement" onclick="flex-' + this.r + '.hide();">' +
		'	<img id="close-' + this.r + '" src="' + this.btn + '" alt="Close" onclick="flex-' + this.r + '.hide();">' +
		'	<a href="' + this.ct + '" target="_blank">' +
		'		<img id="img-' + this.r + '" alt="Advertisement">' +
		'	</a>' +
		'</div>';

	this.js = 'var flex-' + this.r + ' = (function(o) {' +
		'	init();' +
		'	window.onresize = adjustFlex;' +
		'	function init() {' +
		'		preload();' +
		'		adjustFlex();' +
		'	}' +
		'	function preload() {' +
		'		for(i = 0, l = o.images.length; i < l; ++i) {' +
		'			var bg = new Image();' +
		'			var img = new Image();' +
		'			img.src = o.images[i];' +
		'			bg.src = o.bgs[i];' +
		'		}' +
		'		var base1 = new Image();' +
		'		var base2 = new Image();' +
		'		base1.src = o.bases[0];' +
		'		base2.src = o.bases[1];' +
		'	}' +
		'	function init() {' +
		'		document.body.appendChild(o.close);' +
		'		document.body.appendChild(o.base);' +
		'		document.body.appendChild(o.bg);' +
		'		document.body.appendChild(o.box.parentNode);' +
		'		adjustFlex();' +
		'		addClass(o.close, "hidden-' + this.r + '");' +
		'		addClass(o.bg, "hidden-' + this.r + '");' +
		'		addClass(o.box, "hidden-' + this.r + '");' +
		'		addClass(o.close, "gpt-rich-media-content");' +
		'		addClass(o.base, "gpt-rich-media-content");' +
		'		addClass(o.bg, "gpt-rich-media-content");' +
		'		addClass(o.box.parentNode, "gpt-rich-media-content");' +
		'	}' +
		'	function adjustFlex() {' +
		'		var min_dim = Math.min(window.innerWidth, window.innerHeight);' +
		'		if(min_dim <= 480) {' +
		'			o.bg.setAttribute("class", "smartphone-bg-' + this.r + '");' +
		'			o.bg.src = o.bgs[0];' +
		'			o.box.setAttribute("class", "smartphone-box-' + this.r + '");' +
		'			o.box.src = o.images[0];' +
		'		} else if(min_dim > 480 && min_dim <= 600) {' +
		'			o.bg.setAttribute("class", "tweener-bg-' + this.r + '");' +
		'			o.bg.src = o.bgs[1];' +
		'			o.box.setAttribute("class", "tweener-box-' + this.r + '");' +
		'			o.box.src = o.images[1];' +
		'		} else if(min_dim > 600 && min_dim <= 768) {' +
		'			o.bg.setAttribute("class", "tablet-bg-' + this.r + '");' +
		'			o.bg.src = o.bgs[2];' +
		'			o.box.setAttribute("class", "tablet-box-' + this.r + '");' +
		'			o.box.src = o.images[2];' +
		'		} else {' +
		'			o.bg.setAttribute("class", "desktop-bg-' + this.r + '");' +
		'			o.bg.src = o.bgs[3];' +
		'			o.box.setAttribute("class", "desktop-box-' + this.r + '");' +
		'			o.box.src = o.images[3];' +
		'		}' +
		'		if(window.innerWidth < 768) {' +
		'			o.base.style.height = "50px";' +
		'			o.bimg.src = o.bases[0];' +
		'			o.bimg.style.width = "320px";' +
		'			o.state = "handset";' + 
		'		} else {' +
		'			o.base.style.height = "66px";' +
		'			o.bimg.src = o.bases[1];' +
		'			o.bimg.style.width = "768px";' +
		'			o.state = "tablet";' + 
		'		}' +
		'	}' +
		'	function addClass(el, newClass) {' +
		'		var classes = el.getAttribute("class") != null ? el.getAttribute("class").split(" ") : [];' +
		'		if(classes.indexOf(newClass) == -1) {' +
		'			classes.push(newClass);' +
		'			el.setAttribute("class", classes.join(" "));' +
		'		}' +
		'	}' +
		'	function removeClass(el, oldClass) {' +
		'		var classes = el.getAttribute("class") != null ? el.getAttribute("class").split(" ") : [];' +
		'		var index = classes.indexOf(oldClass);' +
		'		if(index != -1) {' +
		'			classes.splice(index, 1);' +
		'			el.setAttribute("class", classes.join(" "));' +
		'		}' +
		'	}' +
		'	function show() {' +
		'		addClass(o.base, "hide-" + o.state + "-' + this.r + '");' +
		'		o.close.style.display = "block";' +
		'		o.bg.style.display = "block";' +
		'		o.box.style.display = "block";' +
		'		setTimeout(function() {' +
		'			removeClass(o.close, "fade-out-' + this.r + '");' +
		'			removeClass(o.bg, "fade-out-' + this.r + '");' +
		'			removeClass(o.box, "fade-out-' + this.r + '");' +
		'			addClass(o.close, "fade-in-' + this.r + '");' +
		'			addClass(o.bg, "fade-in-' + this.r + '");' +
		'			addClass(o.box, "fade-in-' + this.r + '");' +
		'		}, 50);' +
		'	}' +
		'	function hide() {' +
		'		removeClass(o.close, "fade-in-' + this.r + '");' +
		'		removeClass(o.bg, "fade-in-' + this.r + '");' +
		'		removeClass(o.box, "fade-in-' + this.r + '");' +
		'		addClass(o.close, "fade-out-' + this.r + '");' +
		'		addClass(o.bg, "fade-out-' + this.r + '");' +
		'		addClass(o.box, "fade-out-' + this.r + '");' +
		'		setTimeout(function() {' +
		'			o.close.style.display = "none";' +
		'			o.bg.style.display = "none";' +
		'			o.box.style.display = "none";' +
		'			removeClass(o.base, "hide-handset-' + this.r + '");' +
		'			removeClass(o.base, "hide-tablet-' + this.r + '");' +
		'		}, 300);' +
		'	}' +
		'	return {' +
		'		show: show,' +
		'		hide: hide' +
		'	};' +
		'}({' +
		'	close: document.getElementById("close-' + this.r + '"),' +
		'	base: document.querySelector(".base-' + this.r + '"),' +
		'	bimg: document.getElementById("base-img-' + this.r + '"),' +
		'	bg: document.getElementById("bg-' + this.r + '"),' +
		'	box: document.getElementById("img-' + this.r + '"),' +
		'	bases: ["' + this.b1 + '", "' + this.b2 + '"],' +
		'	bgs: ["' + this.bg1 + '", "' + this.bg2 + '", "' + this.bg3 + '", "' + this.bg4 + '"],' +
		'	images: ["' + this.i1 + '", "' + this.i2 + '", "' + this.i3 + '", "' + this.i4 + '"]' +
		'}));';
};

var TAS_Overlay = function(o) {
	this.delivery = 'RM';
	this.adtype = 'Overlay';
	this.w = o.width;
	this.h = o.height;
	this.fl = o.flash;
	this.bi = o.backupImage;
	this.cts = o.clicktags; // array of clicktag URL strings
	this.r = AdMaster.cachebuster();

	/*** custom open/close text/button details ***/
	this.cdt = o.customClose == 'Yes' ? 'none' : 'block';
	this.btn = 'http://a.dolimg.com/ads/close-button.png';

	this.embed = AdMaster.getEmbed(this.w, this.h, this.fl, this.bi, this.cts, this.r);

	this.css = '#basil-ad-' + this.r + ' {' +
		'	position: fixed;' +
		'	top: 0;' +
		'	left: 0;' +
		'	width: 100%;' +
		'	height: 100%;' +
		'	background: background:url("http://a.dolimg.com/ads/lightbox.png");' +
		'	z-index: 1000000000;' +
		'	display: none;' +
		'}' +
		'#overlay-' + this.r + ' {' +
		'	position: absolute;' +
		'	top: 50%;' +
		'	left: 50%;' +
		'	margin-top: -' + this.h/2 + 'px;' +
		'	margin-left: -' + this.w/2 + 'px;' + 
		'}' +
		'#close-' + this.r + ' {' +
		'	position: absolute;' +
		'	top: 0;' +
		'	right: 0;' +
		'	width: 40px;' +
		'	height: 40px;' +
		'	cursor: pointer;' +
		'}';

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '" onclick="close_overlay();">' +
		'	<div id="overlay-' + this.r + '">' +
		'		<img src="' + this.btn + '" id="close-' + this.r + '" onclick="close_overlay();">' +
		'		' + this.embed +
		'	</div>' +
		'</div>';

	this.js = 'var timeout_' + this.r + ';' +
		'function close_overlay() {' +
		'	document.getElementById("basil-ad-' + this.r + '").style.display = "none";' +
		'	clearTimeout(timeout_' + this.r + ');' +
		'}' +
		'function init_' + this.r + '() {' +
		'	document.getElementById("close-' + this.r + '").style.display = "' + this.cdt + '";' +
		'	document.getElementById("basil-ad-' + this.r + '").style.display = "block";' +
		'	timeout_' + this.r + ' = setTimeout(close_' + this.r + ', 10000);' +
		'}' +
		'setTimeout(init_' + this.r + ', 250);';
};

var TAS_Pushdown = function(o) {
	this.delivery = 'RM';
	this.adtype = 'Pushdown';
	this.w = o.width;
	this.ch = o.collapsedHeight;
	this.eh = o.expandedHeight;
	this.afl = o.autoFlash;
	this.abi = o.autoBackupImage;
	this.ufl = o.userFlash;
	this.ubi = o.userBackupImage;
	this.cfl = o.collapsedFlash;
	this.cbi = o.collapsedBackupImage;
	this.cts = o.clicktags; // array of clicktag URL strings
	this.r = AdMaster.cachebuster();

	/*** custom open/close text/button details ***/
	this.ot = 'Show Ad'; // prompt to open billboard
	this.ct = 'Close Ad'; // prompt to close billboard
	this.oc = o.openTextColor || '#444';
	this.cc = o.closeTextColor || '#444';
	this.odt = o.customOpen == 'Yes' ? 'none' : 'block';
	this.cdt = o.customClose == 'Yes' ? 'none' : 'block';
	this.down = 'http://a.dolimg.com/ads/down_arrow.png';
	this.up = 'http://a.dolimg.com/ads/up_arrow.png';

	this.autoEmbed = AdMaster.getEmbed(this.w, this.eh, this.afl, this.abi, this.cts, this.r);
	this.userEmbed = AdMaster.getEmbed(this.w, this.eh, this.ufl, this.ubi, this.cts, this.r);
	this.collEmbed = AdMaster.getEmbed(this.w, this.ch, this.cfl, this.cbi, this.cts, this.r);

	this.css = '#basil-ad-' + this.r + ' {' +
		'	position: relative;' +
		'	z-index: 1000000000;' +
		'	display:none;' +
		'}' +
		'#open-text-' + this.r + ', #close-text-' + this.r + ' {' +
		'	position: absolute;' +
		'	top: 0;' +
		'	right: 25px;' +
		'	margin: 5px;' +
		'	font-family: Helvetica, Arial, sans-serif;' +
		'	font-size: 14px;' +
		'	line-height: 20px;' +
		'	cursor: pointer;' +
		'}' +
		'#open-text-' + this.r + ':hover, #close-text-' + this.r + ':hover {' +
		'	text-decoration: underline;' +
		'}' +
		'#open-text-' + this.r + ' {' +
		'	color: ' + this.oc + ';' +
		'	display: ' + this.odt + ';' +
		'}' +
		'#close-text-' + this.r + ' {' +
		'	color: ' + this.cc + ';' +
		'	display: none;' +
		'}' +
		'#open-button-' + this.r + ', #close-button-' + this.r + ' {' +
		'	position: absolute;' +
		'	top: 0;' +
		'	right: 0;' +
		'	margin: 5px;' +
		'	width: 20px;' +
		'	height: 20px;' +
		'	cursor: pointer;' +
		'}' +
		'#close-button-' + this.r + ' {' +
		'	display: none;' +
		'}' +
		'#pushdown-auto-' + this.r + ', #pushdown-user-' + this.r + ', #pushdown-coll-' + this.r + ' {' +
		'	display: none;' +
		'}';

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '">' +
		'	<div id="open-text-' + this.r + '" onclick="open_pushdown();">' + this.ot + '</div>' +
		'	<div id="close-text-' + this.r + '" onclick="close_pushdown();">' + this.ct + '</div>' +
		'	<img src="' + this.down + '" id="open-button-' + this.r + '" onclick="open_pushdown();">' +
		'	<img src="' + this.up + '" id="close-button-' + this.r + '" onclick="close_pushdown();">' +
		'	<div id="pushdown-auto-' + this.r + '">' +
		'		' + this.autoEmbed +
		'	</div>' +
		'	<div id="pushdown-user-' + this.r + '">' +
		'		' + this.userEmbed +
		'	</div>' +
		'	<div id="pushdown-coll-' + this.r + '">' +
		'		' + this.collEmbed +
		'	</div>' +
		'</div>';

	this.cookie = AdMaster.getCookieLoader(this.r);

	this.js = this.cookie +
		'var timeout_' + this.r + ';' +
		'function open_pushdown() {' +
		'	if(typeof sendJSEvent == "function") sendJSEvent("pauseVideo");' +
		'	document.getElementById("open-button-' + this.r + '").style.display = "none";' +
		'	document.getElementById("close-button-' + this.r + '").style.display = "' + this.cdt + '";' +
		'	document.getElementById("open-text-' + this.r + '").style.display = "none";' +
		'	document.getElementById("close-text-' + this.r + '").style.display = "' + this.cdt + '";' +
		'	document.getElementById("basil-ad-' + this.r + '").style.height = "' + this.eh + 'px";' +
		'	document.getElementById("pushdown-coll-' + this.r + '").style.display = "none";' +
		'	document.getElementById("pushdown-user-' + this.r + '").style.display = "block";' +
		'}' +
		'function close_pushdown() {' +
		'	if(typeof sendJSEvent == "function") sendJSEvent("playVideo");' +
		'	document.getElementById("open-button-' + this.r + '").style.display = "' + this.odt + '";' +
		'	document.getElementById("close-button-' + this.r + '").style.display = "none";' +
		'	document.getElementById("open-text-' + this.r + '").style.display = "' + this.odt + '";' +
		'	document.getElementById("close-text-' + this.r + '").style.display = "none";' +
		'	document.getElementById("basil-ad-' + this.r + '").style.height = "' + this.ch + 'px";' +
		'	document.getElementById("pushdown-auto-' + this.r + '").style.display = "none";' +
		'	document.getElementById("pushdown-user-' + this.r + '").style.display = "none";' +
		'	document.getElementById("pushdown-coll-' + this.r + '").style.display = "block";' +
		'	clearTimeout(timeout_' + this.r + ');' + 
		'}' +
		'function init_' + this.r + '() {' +
		'	document.getElementById("basil-ad-' + this.r + '").style.width = "' + this.w + 'px";' +
		'	document.getElementById("basil-ad-' + this.r + '").style.display = "inline-block";' +
		'	if(cookie_' + this.r + '.read("disney_site_visit") == undefined) {' +
		'		if(typeof sendJSEvent == "function") sendJSEvent("pauseVideo");' +
		'		document.getElementById("open-button-' + this.r + '").style.display = "none";' +
		'		document.getElementById("close-button-' + this.r + '").style.display = "' + this.cdt + '";' +
		'		document.getElementById("open-text-' + this.r + '").style.display = "none";' +
		'		document.getElementById("close-text-' + this.r + '").style.display = "' + this.cdt + '";' +
		'		document.getElementById("basil-ad-' + this.r + '").style.height = "' + this.eh + 'px";' +
		'		document.getElementById("pushdown-auto-' + this.r + '").style.display = "block";' +
		'		cookie_' + this.r + '.create("disney_site_visit", "true", "eod");' +
		'		timeout_' + this.r + ' = setTimeout(close_pushdown, 10000);' +
		'	} else {' +
		'		if(typeof sendJSEvent == "function") sendJSEvent("playVideo");' +
		'		document.getElementById("open-button-' + this.r + '").style.display = "' + this.odt + '";' +
		'		document.getElementById("close-button-' + this.r + '").style.display = "none";' +
		'		document.getElementById("open-text-' + this.r + '").style.display = "' + this.odt + '";' +
		'		document.getElementById("close-text-' + this.r + '").style.display = "none";' +
		'		document.getElementById("basil-ad-' + this.r + '").style.height = "' + this.ch + 'px";' +
		'		document.getElementById("pushdown-coll-' + this.r + '").style.display = "block";' +
		'	}' +
		'}' +
		'setTimeout(init_' + this.r + ', 250);';
};

var TAS_Sidekick = function(o) {
	this.delivery = 'RM';
	this.adtype = 'Sidekick';
	this.bw = o.baseWidth;
	this.bh = o.baseHeight;
	this.sw = o.sidekickWidth;
	this.sh = o.sidekickHeight;
	this.bfl = o.baseFlash;
	this.bbi = o.baseBackupImage;
	this.sfl = o.sidekickFlash;
	this.sbi = o.sidekickBackupImage;
	this.cts = o.clicktags; // array of clicktag URL strings
	this.r = AdMaster.cachebuster();

	/*** custom open/close text/button details ***/
	this.cdt = o.customClose == 'Yes' ? 'none' : 'block';
	this.btn = 'http://a.dolimg.com/ads/close-button.png';

	this.baseEmbed = AdMaster.getEmbed(this.bw, this.bh, this.bfl, this.bbi, ['javascript:open_sidekick();'], this.r, '_self');
	this.sideEmbed = AdMaster.getEmbed(this.sw, this.sh, this.sfl, this.sbi, this.cts, this.r);

	this.css = '#basil-ad-' + this.r + ' {' +
		'	position: relative;' +
		'}' +
		'#sidekick-' + this.r + ' {' +
		'	position: fixed;' +
		'	top: 0;' +
		'	right: -' + this.sw + 'px;' +
		'	width: ' + this.sw + 'px;' +
		'	height: ' + this.sh + 'px;' +
		'	z-index: 1000000000;' +
		'}' +
		'#close-' + this.r + ' {' +
		'	position: absolute;' +
		'	top: 5px;' +
		'	left: 5px;' +
		'	width: 30px;' +
		'	height: 30px;' +
		'	display: ' + this.cdt + ';' +
		'}';

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '">' +
		'	' + this.baseEmbed + 
		'	<div id="sidekick-' + this.r + '">' +
		'		<img src="' + this.btn + '" id="close-' + this.r + '" onclick="close_sidekick();">' +
		'		' + this.sideEmbed +
		'	</div>' +
		'</div>';

	this.js = 'var base_' + this.r + ' = document.getElementById("basil-ad-' + this.r + '"),' +
		'	sidekick_' + this.r + ' = document.getElementById("sidekick-' + this.r + '"),' +
		'	margin_' + this.r + ' = ' + (this.bw + this.sw) + ' + getOffsetLeft(base_' + this.r + ') - document.body.offsetWidth;' +
		'function getOffsetLeft(el) {' +
		'	var left = 0;' +
		'	do {' +
		'		if(!isNaN(el.offsetLeft)) left += el.offsetLeft;' +
		'	} while(el = el.offsetParent);' +
		'	return left;' +
		'}' +
		'function animate_' + this.r + '(el, startRight, endRight, time, frame) {' +
		'	var timeout = 1000/48;' + 
		'	var frames = Math.floor(time/timeout);' +
		'	el.style.right = startRight + (endRight - startRight)*frame/frames + "px";' +
		'	if(frame < frames) {' +
		'		setTimeout(function() {' +
		'			animate_' + this.r + '(el, startRight, endRight, time, frame + 1);' +
		'		}, timeout);' +
		'	}' +
		'}' +
		'function open_sidekick() {' +
		'	animate_' + this.r + '(document.body, 0, margin_' + this.r + ', 600, 0);' +
		'	animate_' + this.r + '(sidekick_' + this.r + ',  -' + this.sw + ', 0, 600, 0);' +
		'}' +
		'function close_sidekick() {' +
		'	animate_' + this.r + '(document.body, margin_' + this.r + ', 0, 600, 0);' +
		'	animate_' + this.r + '(sidekick_' + this.r + ', 0, -' + this.sw + ', 600, 0);' +
		'}' +
		'function init_' + this.r + '() {' +
		'	sidekick_' + this.r + '.setAttribute("class", "gpt-rich-media-content");' +
		'	document.body.style.position = "relative";' +
		'	document.body.appendChild(sidekick_' + this.r + ');' +
		'}' +
		'setTimeout(init_' + this.r + ', 250);';
};

var TAS_Slider = function(o) {
	this.delivery = 'RM';
	this.adtype = 'Slider';
	this.bw = o.baseWidth;
	this.bh = o.baseHeight;
	this.sw = o.sliderWidth;
	this.sh = o.sliderHeight;
	this.bi = o.baseImage;
	this.si = o.sliderImage;
	this.ct = o.clickThroughUrl;
	this.r = AdMaster.cachebuster();

	/*** custom open/close text/button details ***/
	this.btn = 'http://a.dolimg.com/ads/close-button.png';

	this.css = 'body {' +
		'	position: relative !important;' +
		'	-webkit-transition-duration: 600ms;' +
		'	-moz-transition-duration: 600ms;' +
		'	-ms-transition-duration: 600ms;' +
		'}' +
		'#basil-ad-' + this.r + ' {' +
		'	position: relative;' +
		'}' +
		'#base-' + this.r + ' {' +
		'	width: ' + this.bw + 'px;' +
		'	height: ' + this.bh + 'px;' +
		'}' +
		'#slider-wrapper-' + this.r + ' {' +
		'	position: fixed;' +
		'	top: 0;' +
		'	z-index: 1000000000;' +
		'	-webkit-transition-duration: 600ms;' +
		'	-moz-transition-duration: 600ms;' +
		'	-ms-transition-duration: 600ms;' +
		'}' +
		'#slider-' + this.r + ' {' +
		'	width: ' + this.sw + 'px;' +
		'	height: ' + this.sh + 'px;' +
		'}' +
		'#close-' + this.r + ' {' +
		'	position: absolute;' +
		'	top: 5px;' +
		'	left: 5px;' +
		'	width: 30px;' +
		'	height: 30px;' +
		'	z-index: 1;' +
		'}' +
		'.hide-body-' + this.r + ' {' +
		'	left: -' + this.sw + 'px;' +
		'}' +
		'.show-body-' + this.r + ' {' +
		'	left: 0;' +
		'}' +
		'.show-' + this.r + ' {' +
		'	right: 0;' +
		'}' +
		'.hide-' + this.r + ' {' +
		'	right: -' + this.sw + 'px;' +
		'}';

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '">' +
		'	<img src="' + this.bi + '" alt="Advertisement" id="base-' + this.r + '" onclick="show_' + this.r + '();" onload="swipe_' + this.r + '(this, show_' + this.r + ', function(){});">' +
		'	<div id="slider-wrapper-' + this.r + '" class="hide-' + this.r + '">' +
		'		<img src="' + this.btn + '" id="close-' + this.r + '" alt="Close" onclick="hide_' + this.r + '();">' +
		'		<a href="' + this.ct + '" target="_blank">' +
		'			<img src="' + this.si + '" id="slider-' + this.r + '" alt="Advertisement" onload="swipe_' + this.r + '(this, function(){}, hide_' + this.r + ');">' +
		'		</a>' +
		'	</div>' +
		'</div>';

	this.js = 'function show_' + this.r + '() {' +
		'	document.getElementById("slider-wrapper-' + this.r + '").className = "show-' + this.r + '";' +
		'	document.body.className = "hide-body-' + this.r + '";' +
		'}' +
		'function hide_' + this.r + '() {' +
		'	document.getElementById("slider-wrapper-' + this.r + '").className = "hide-' + this.r + '";' +
		'	document.body.className = "show-body-' + this.r + '";' +
		'}' +
		'function swipe_' + this.r + '(el, leftCallback, rightCallback) {' +
		'	var startX, startY, dx, dy;' +
		'	function touchStart(e) {' +
		'		startX = e.touches[0].pageX;' +
		'		startY = e.touches[0].pageY;' +
		'		dx = 0;' +
		'		dy = 0;' +
		'		el.addEventListener("touchmove", touchMove, false);' +
		'		el.addEventListener("touchend", touchEnd, false);' +
		'	}' +
		'	function touchMove(e) {' +
		'		e.preventDefault();' +
		'		dx = e.touches[0].pageX - startX;' +
		'		dy = e.touches[0].pageY - startY;' +
		'		if(Math.abs(dx) >= 30 && Math.abs(dy) < 75) {' +
		'			if(dx > 0) {' +
		'				rightCallback();' +
		'			} else {' +
		'				leftCallback();' +
		'			}' +
		'			cancelTouch();' +
		'		}' +
		'	}' +
		'	function touchEnd(e) {' +
		'		cancelTouch();' +
		'	}' +
		'	function cancelTouch() {' +
		'		el.removeEventListener("touchmove", touchMove);' +
		'		el.removeEventListener("touchend", touchEnd);' +
		'		startX = null;' +
		'		startY = null;' +
		'	}' +
		'	el.addEventListener("touchstart", touchStart, false);' +
		'}' +
		'document.body.className = "show-body-' + this.r + '";';
};

var TAS_SponsoredBy = function(o) {
	this.delivery = 'RM';
	this.adtype = 'Sponsored By';
	this.w = o.width;
	this.h = o.height;
	this.text = o.sponsoredByText ? '<div>' + o.sponsoredByText + '</div>' : '';
	this.img = o.image;
	this.ct = o.clickThroughUrl;
	this.r = AdMaster.cachebuster();

	this.css = '#basil-ad-' + this.r + ' {' +
		'	text-align: center;' +
		'	width: ' + this.w + ';' +
		'	height: ' + this.h + ';' +
		'	font-family: Helvetica, Arial, sans-serif;' +
		'	font-size: 10px;' +
		'	color: #999;'
		'}';

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '">' + presby +
		'    <div align="center">' +
		'     	<a href="' + this.ct + '" target="_blank">' +
		'     		<img src="' + this.img + '" border="0" width="' + this.w + '" height="' + this.h + '">' +
		'     	</a>' +
		'    </div>' +
		'</div>';
};

var TAS_StaticSiteServed = function(o) {
	this.delivery = 'Standard';
	this.adtype = o.flash ? 'Flash' : 'Static Image';
	this.w = o.width;
	this.h = o.height;
	this.fl = o.flash;
	this.bi = window.devicePixelRatio >= 2 && o.retinaImage != '' ? o.retinaImage : o.backupImage;
	this.cts = o.clicktags; // array of clicktag URL strings
	this.r = AdMaster.cachebuster();

	this.embed = AdMaster.getEmbed(this.w, this.h, this.fl, this.bi, this.cts, this.r);

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '">' +
		'	<div id="sss-' + this.r + '">' +
		'		' + this.embed +
		'	</div>' +
		'</div>';
};

var TAS_ThirdParty = function(o) {
	this.delivery = 'Standard';
	this.adtype = 'Third Party';
	this.w = o.width;
	this.h = o.height;
	this.r = AdMaster.cachebuster();

	// External HTML Wrapper
	this.el = document.getElementById('html-holder');
	this.tag = this.el.textContent || this.el.innerText;

	var vendor = this.tag.match(/pointroll|spongecell|dmtry|atdmt|BurstingPipe|pictela|jivox|flite|adsafe|interpolls|eyereturn|phluant|celtra|crisp|medialytics|mixpo|bluelithium|uac\.advertising|pubmatic|rubicon|doubleclick/)[0]; //PointRoll,Spongecell, Adometry, Atlas, MediaMind, Pictela, Jivox, Flite, AdSafe, Interpolls, eyeReturn, Phluant, Celtra, Crisp, Medialets, Mixpo, 5 to 1, Ad.com, Pubmatic, Rubicon, DoubleClick
	
	switch(vendor) {
		case 'pointroll':
			this.adtype += ' (PointRoll)';
			break;
		case 'spongecell':
			this.adtype += ' (Spongecell)';
			break;
		case 'dmtry':
			this.adtype += ' (Adometry)';
			break;
		case 'atdmt':
			this.adtype += ' (Atlas)';
			break;
		case 'BurstingPipe':
			this.adtype += ' (MediaMind)';
			break;
		case 'pictela':
			this.adtype += ' (Pictela)';
			break;
		case 'jivox':
			this.adtype += ' (Jivox)';
			break;
		case 'flite':
			this.adtype += ' (Flite)';
			break;
		case 'adsafe':
			this.adtype += ' (AdSafe)';
			break;
		case 'interpolls':
			this.adtype += ' (Interpolls)';
			break;
		case 'eyereturn':
			this.adtype += ' (eyeReturn)';
			break;
		case 'phluant':
			this.adtype += ' (Phluant)';
			break;
		case 'celtra':
			this.adtype += ' (Celtra)';
			break;
		case 'crisp':
			this.adtype += ' (Crisp)';
			break;
		case 'medialytics':
			this.adtype += ' (Medialets)';
			break;
		case 'mixpo':
			this.adtype += ' (Mixpo)';
			break;
		case 'bluelithium':
			this.adtype += ' (5 to 1)';
			break;
		case 'uac.advertising':
			this.adtype += ' (Ad.com)';
			break;
		case 'pubmatic':
			this.adtype += ' (Pubmatic)';
			break;
		case 'rubicon':
			this.adtype += ' (Rubicon)';
			break;
		case 'doubleclick':
			this.adtype += ' (DoubleClick)';
			break;
	}

	this.html = '<div id="basil-ad-' + this.r + '" data-adtype="' + this.adtype + '">' +
		'	' + this.tag +
		'</div>';
};

var TAS_Wallpaper = function(o) {
	this.delivery = 'RM';
	this.adtype = 'Wallpaper';
	this.i = o.image;
	this.bc = o.backupColor;
	this.br = o.tileBackground == 'Yes' ? 'repeat' : 'no-repeat';
	this.ba = o.fixBackground == 'Yes' ? 'fixed' : 'scroll';
	this.bp = '50% 0';

	this.css = 'body {' +
		'	background-image: url("' + this.i + '") !important;' +
		'	background-repeat: ' + this.br + ' !important;' +
		'	background-attachment: ' + this.ba + ' !important;' +
		'	background-position: ' + this.bp + ' !important;' +
		(this.bc ? '	background-color: ' + this.bc + ' !important;' : '') +
		'}';
};
