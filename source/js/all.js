const clientId = 'qvtuq71csrlv5ipxo1ljzgbzqn1okh' ;
const limitItem = 21;
let offset = 0 ;
let apiUrl;
let isLoad = false ;
let isLoadLastItem = false ;
let liveCounter = 0 ;
var languageType = "en" ;
// webpack
var i18n = {
	en: require("./lang-en"),
	'zh-tw': require("./lang-zh-tw")
};

window.onload=function(){
	queryLive(procesLiveInfo) ;
}

document.querySelector(".lang_en").onclick = function() {
	language("en");
}

document.querySelector(".lang_tw").onclick = function() {
	language("zh-tw");
}

window.addEventListener('scroll', function(e) {
	const documentBodyScrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
	const body = document.body;
	const html = document.documentElement;
	const documentHeight = Math.max(
		body.offsetHeight,
		body.scrollHeight,
		html.clientHeight,
		html.offsetHeight,
		html.scrollHeight
	);
	
	if (documentBodyScrollTop + window.innerHeight + 200 >= documentHeight) {
		if (liveCounter < limitItem) isLoadLastItem = true ;

		if (isLoad &&  !isLoadLastItem){
			isLoad = false ;

			offset+= limitItem;
			queryLive(procesLiveInfo) ;
			console.log("offset = " + offset);
		}
	}
});

function newAjax() {
	var ajax;
	if (window.XMLHttpRequest) {
		// this is for IE 7+, Chrome, Safri and fireFox
		ajax = new XMLHttpRequest();
	}
	else {
		// this is for IE6 and IE 5
		ajax = new ActiveXobjext("Microsoft.XMLHTTP")
	}
	return ajax;
}

function queryLive(cb) {
	var ajaxHandler = newAjax();
	apiUrl =  "https://api.twitch.tv/kraken/streams/?client_id=" + clientId +
						"&language=" + languageType + 
						"&game=League%20of%20Legends&limit=" + limitItem + 
						"&offset=" + offset ;
	ajaxHandler.onreadystatechange = function(){
		if (ajaxHandler.readyState==4 && ajaxHandler.status==200) {
			// json to object
			var respData = JSON.parse(ajaxHandler.responseText) ;
			console.log(respData);
			isLoad = true ;
			cb(null, respData);
		}
	}
	ajaxHandler.open("get", apiUrl, true);
	ajaxHandler.send();
}

function procesLiveInfo(err,data) {
	if (err) {
		console.log(err);
	}
	else {
		const streams =  data.streams;
		const row = document.querySelectorAll('.row');
		liveCounter = streams.length;
		for (let i=0 ; i<streams.length ; i++ ) {
			row[0].insertAdjacentHTML( 'beforeend', getColumn(streams[i]));
		}
	}
}

function getColumn(data) {
	return `
	<div class="col">
		<div class="preview">
			<img src="${data.preview.large}" onload="this.style.opacity=1" alt="">
		</div>
		<div class="descript">
			<div class="avatar">
				<img src="${data.channel.logo}"  onload="this.style.opacity=1" alt="">
			</div>
			<div class="introduce">
				<div class="ch-name">${data.channel.status}</div>
				<div class="ch-master">${data.channel.name}</div>
			</div>
		</div>
	</div>
	`;
}

function language(lang) {
	if (lang !== languageType) {
		const col = document.querySelectorAll('.col');
		for (let i=0 ; i<col.length ; i++ ) {
			col[i].remove();
		}

		// add i18n
		// not webpack
		// document.querySelector(".head h1").textContent = window.i18n[lang].title;
		// webpack
		document.querySelector(".head h1").textContent = i18n[lang].title;

		languageType = lang;
		offset = 0;
		queryLive(procesLiveInfo) ;
	}
} 
