(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{107:function(e,t,a){e.exports=a(208)},112:function(e,t,a){},206:function(e,t,a){e.exports=a.p+"static/media/logo.ee7cd8ed.svg"},207:function(e,t,a){},208:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(7),o=a.n(r),c=(a(112),a(44)),i=a(45),s=a(55),u=a(56),m=a(10),d=["user-read-email"],p=a(95),g=a(242),y=a(243),f=window.location.hash.substring(1).split("&").reduce(function(e,t){if(t){var a=t.split("=");e[a[0]]=decodeURIComponent(a[1])}return e},{});window.location.hash="";var h=f,b=a(11),E=(a(97),a(241)),v=(a(245),a(246)),k=a(96),w=a(47),O=a(13),j=a(94),S=a.n(j),x={name:"",id:"",token:"",tokenms:0,allPlaylists:[],filteredPlaylists:[],selectedAlbums:[],allAlbums:{},selectedPlaylists:[],progress:{done:0,total:0,percent:0},log:function(e,t){var a=t||"normal",n="> "+e;I.logArray.push({text:n,color:{start:"cornflowerblue",normal:"#ddd",end:"lightgreen",error:"red"}[a]});var l=document.getElementById("logger");l.scrollTop=l.scrollHeight+50},logArray:[],errors:[]};var I=Object(w.a)(null!=localStorage.getItem("user")?S()(x,JSON.parse(localStorage.getItem("user"))):x);Object(O.c)(function(){localStorage.setItem("user",JSON.stringify(I))}),window.user=I;var B=a(24),C=a.n(B),_=a(36),P=a(98),T=a(57),A=a(238),D=a(244),N=a(23),R=a.n(N);function z(e){for(var t=[],a=[],n=0;n<e.length;n++){var l=e[n],r=l.owner.display_name;"Spotify"!==r&&(r.indexOf(" ")>-1?t.push(l):1===(r.match(/./g)||[]).length?(l.owner.display_name=r.split(".").join(" "),t.push(l)):a.push(l))}return t}function F(e){var t=localStorage.getItem("previousPlaylists"),a=[];if(!t)return e;for(var n=0;n<e.length;n++)-1===t.indexOf(e[n].id)&&a.push(e[n]);return a}var G=function(e){var t=e.token,a=Object(n.useState)(""),r=Object(b.a)(a,2),o=r[0],c=r[1],i=Object(n.useState)([]),s=Object(b.a)(i,2),u=s[0],m=s[1],d=Object(n.useState)(0),p=Object(b.a)(d,2),g=p[0],y=p[1],f=Object(n.useState)([]),h=Object(b.a)(f,2),E=h[0],k=h[1],w=Object(n.useState)("none"),O=Object(b.a)(w,2),j=O[0],S=O[1],x=Object(n.useState)(0),I=Object(b.a)(x,2),B=I[0],N=I[1],G=Object(n.useState)(0),J=Object(b.a)(G,2),L=J[0],M=J[1],q=Object(n.useState)(0),H=Object(b.a)(q,2),W=H[0],K=H[1],U=Object(n.useState)([]),Y=Object(b.a)(U,2),Q=Y[0],V=Y[1],X=Object(n.useState)(0),Z=Object(b.a)(X,2),$=Z[0],ee=Z[1];Object(n.useEffect)(function(){console.log(t),document.getElementById("message").value=localStorage.getItem("message")||"Hey {first name},\nI stumbled on your {playlist name} playlist on Spotify (if it actually is your playlist) and I really enjoy it!\n\nA friend of mine, an aspiring instrumental pianist from Edmonton, Canada, recently released a new single that may fit nicely on your playlist! If you want to check it out, it\u2019s called {song name}.\n\n{song link}\n\nThanks for reading my message and keep up your great taste in music! Sorry for the unsolicited message, but I hope you enjoy the music and have a wonderful day!\n\nTyler"},[]);function te(){return ae.apply(this,arguments)}function ae(){return(ae=Object(T.a)(C.a.mark(function e(){var a,n,l,r,c,i,s,u,d,p,f,h,b;return C.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log(o),a=[],e.prev=3;case 4:return e.next=6,R.a.get(n||"https://api.spotify.com/v1/search?q=".concat(o,"&type=playlist&limit=50&offset=").concat(g),{headers:{Authorization:"Bearer "+t,"Content-Type":"application/json"}});case 6:r=e.sent,n=r.data.playlists.next,(l=a).push.apply(l,Object(_.a)(r.data.playlists.items)),console.log(r),K(r.data.playlists.total);case 12:if(n&&a.length<100){e.next=4;break}case 13:e.next=18;break;case 15:e.prev=15,e.t0=e.catch(3),S("block");case 18:c=g+a.length,y(c),i=a.length,console.log(i),a=z(a),s=i-a.length,console.log(s),N(s),a=F(a),u=i-s-a.length,console.log(u),M(u),d=[],p=0,f=0;case 33:if(!(f<a.length)){e.next=50;break}return h=a[f],console.log(f),b=void 0,e.prev=37,e.next=40,R.a.get("https://api.spotify.com/v1/users/".concat(h.owner.id),{headers:{Authorization:"Bearer "+t,"Content-Type":"application/json"}});case 40:b=e.sent,e.next=46;break;case 43:return e.prev=43,e.t1=e.catch(37),e.abrupt("continue",47);case 46:b.data.images.length>0?d.push({id:h.id,name:h.name,owner:h.owner.display_name,image:b.data.images[0].url}):p++;case 47:f++,e.next=33;break;case 50:ee(p),m(d);case 52:case"end":return e.stop()}},e,null,[[3,15],[37,43]])}))).apply(this,arguments)}var ne=function(){var e=Object(T.a)(C.a.mark(function e(a){var n,l,r,o,c,i;return C.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.target.id,l=u.find(function(e){return e.id===n}),r=[],document.getElementById(a.target.id).parentElement.style.opacity=.2,e.prev=4,c="https://api.spotify.com/v1/playlists/".concat(n),e.next=8,R.a.get(c,{headers:{Authorization:"Bearer "+t,"Content-Type":"application/json"}});case 8:200===(o=e.sent).status?(console.log("got data",o.data.name),(i=o.data).followers.total>3&&(r=Object(P.a)({},l,{playlist_url:i.external_urls.spotify,owner_url:i.owner.external_urls.spotify,followers:i.followers.total}),k([].concat(Object(_.a)(E),[r])))):S("block"),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(4),S("block");case 15:case"end":return e.stop()}},e,null,[[4,12]])}));return function(t){return e.apply(this,arguments)}}(),le=function(){var e=Object(T.a)(C.a.mark(function e(){var t,a,n,r;return C.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:for(t=[],a=JSON.parse(JSON.stringify(E)),n=0;n<a.length;n++)r=a[n],t[n]=l.a.createElement("tr",{key:n},l.a.createElement("td",null,r.name),l.a.createElement("td",null,r.playlist_url),l.a.createElement("td",null,r.owner),l.a.createElement("td",null,r.owner_url),l.a.createElement("td",null,r.followers),l.a.createElement("td",null,document.getElementById("song-name").value),l.a.createElement("td",null,o),l.a.createElement("td",null,document.getElementById("fblink-".concat(r.id)).value||"nay"),l.a.createElement("td",null,""),l.a.createElement("td",null,document.getElementById("messaged-".concat(r.id)).checked?"yee":"nay"),l.a.createElement("td",null,document.getElementById("messaged-".concat(r.id)).checked?document.getElementById("user-name").value:""),l.a.createElement("td",null,""),l.a.createElement("td",null,document.getElementById("messaged-".concat(r.id)).checked?new Date(Date.now()).toLocaleDateString():""));V(t);case 4:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),re=u.map(function(e){return l.a.createElement("div",{style:{width:220,background:"#ccc",margin:10,padding:10,position:"relative"},key:e.id},l.a.createElement("img",{src:e.image,alt:"owner",style:{width:"100%"},id:e.id,onClick:ne}),l.a.createElement("p",null,l.a.createElement("strong",null,e.owner)),l.a.createElement("p",null,e.name))}),oe=E.map(function(e){return l.a.createElement("div",{key:e.id,style:{display:"flex",flexDirection:"row"}},l.a.createElement("img",{src:e.image,height:100,alt:"pic"}),l.a.createElement("div",{style:{minWidth:400}},l.a.createElement("h3",{style:{margin:2,padding:5}},e.owner),l.a.createElement("h4",{style:{margin:2,padding:5}},e.name),l.a.createElement("p",{style:{margin:2,padding:5}},e.followers," followers")),l.a.createElement("div",null,l.a.createElement("a",{href:"https://www.facebook.com/search/people/?q=".concat(e.owner),target:"_blank",rel:"noopener noreferrer",onClick:function(){return function(e){var t=document.getElementById("message").value,a=document.getElementById("song-name").value,n=document.getElementById("song-link").value,l=t.replace("{first name}",e.owner.split(" ")[0]).replace("{playlist name}",e.name).replace("{song name}",a).replace("{song link}",n),r=document.createElement("textarea");r.style.position="fixed",r.style.top=0,r.style.left=0,r.style.width="2em",r.style.height="2em",r.style.padding=0,r.style.border="none",r.style.outline="none",r.style.boxShadow="none",r.style.background="transparent",r.value=l,document.body.appendChild(r),r.focus(),r.select();try{var o=document.execCommand("copy")?"successful":"unsuccessful";console.log("Copying text command was "+o)}catch(c){console.log("Oops, unable to copy")}document.body.removeChild(r)}(e)}},"Search on Facebook"),l.a.createElement("br",null),l.a.createElement("input",{placeholder:"Paste FB here",id:"fblink-".concat(e.id)}),l.a.createElement("br",null),l.a.createElement("input",{type:"checkbox",id:"messaged-".concat(e.id),name:"messaged"}),l.a.createElement("label",{for:"messaged"}," Messaged them")))});return l.a.createElement(A.a,{fixed:!0,style:{marginTop:50}},l.a.createElement("h3",null,"1. Setup"),l.a.createElement(v.a,{variant:"contained",color:"primary",onClick:function(){localStorage.removeItem("token"),window.location.reload()}},"Get Spotify token"),l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement(D.a,{id:"user-name",label:"Your Initials",variant:"outlined",style:{width:"50%",marginBottom:20}}),l.a.createElement("br",null),l.a.createElement(D.a,{id:"song-name",label:"Promoting Song Name",variant:"outlined",style:{width:"50%",marginBottom:20}}),l.a.createElement(D.a,{id:"song-link",label:"Promoting Song Link",variant:"outlined",style:{width:"50%",marginBottom:20}}),l.a.createElement("br",null),l.a.createElement(D.a,{id:"previous-playlists",label:"List of playlist links we've already got",variant:"outlined",style:{width:"50%",marginBottom:20}}),l.a.createElement("br",null),l.a.createElement(v.a,{variant:"contained",color:"primary",onClick:function(){return function(){var e=document.getElementById("previous-playlists").value,t=e.indexOf("https"),a=(e=e.substring(t)).split(" ");a=a.map(function(e,t){var a=e.lastIndexOf("/");return e.substring(a+1)}),localStorage.setItem("previousPlaylists",JSON.stringify(a))}()}},"Process saved playlists"),l.a.createElement("h3",null,"2. Make sure the message looks good"),l.a.createElement(D.a,{style:{width:"100%",minHeight:300},label:"Message",variant:"outlined",multiline:!0,id:"message"}),l.a.createElement(v.a,{variant:"contained",color:"primary",onClick:function(){return localStorage.setItem("message",document.getElementById("message").value)}},"Save"),l.a.createElement("h3",null,"3. Search for playlists on Spotify"),l.a.createElement("div",null,l.a.createElement(D.a,{id:"outlined-basic",label:"Spotify Search Term",variant:"outlined",style:{width:"50%",marginBottom:20},onChange:function(e){c(e.target.value),console.log(e.key)},onKeyDown:function(e){"Enter"===e.key&&te()}}),l.a.createElement("br",null)),l.a.createElement("div",null,l.a.createElement("p",{style:{display:g>0?"block":"none"}},"Gathering 100 playlists out of ",W,"... Filtered"," ",B," unlikely names... Filtered"," ",L," previously logged playlists... Filtered"," ",$," without profile pictures... Returning"," ",u.length,".")),l.a.createElement("h3",null,"4. Pick promising playlists"),l.a.createElement("div",{style:{background:"green",display:"flex",flexDirection:"row",flexWrap:"wrap",borderRadius:20,marginTop:20}},re),l.a.createElement("br",null),l.a.createElement(v.a,{variant:"contained",color:"primary",onClick:function(){return te()}},"Get 100 more"),l.a.createElement("h3",null,"5. Find and message them on Facebook"),l.a.createElement("ol",null,oe),l.a.createElement("br",null),l.a.createElement("h3",null,"6. Generate text to paste into the tracking spreadsheet"),l.a.createElement(v.a,{variant:"contained",color:"primary",onClick:function(){return le()}},"Generate Copy Text"),l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement("table",{style:{width:"100%",border:"2px solid black"}},Q),l.a.createElement("div",{style:{position:"fixed",display:j,width:"100%",height:50,background:"red",top:0,left:0,textAlign:"center"}},l.a.createElement("p",{style:{color:"white"}},"Error with Spotify request - please get new Spotify token (step 1)")))};var J=Object(E.a)(function(e){return{root:{flexGrow:1,height:"calc(100vh - 48px)"}}}),L=Object(w.b)(function(e){J();var t=e.token,a=Object(n.useState)(0),r=Object(b.a)(a,2),o=(r[0],r[1],Object(n.useState)(I.tokenms-Date.now())),c=Object(b.a)(o,2),i=c[0],s=c[1];Object(n.useEffect)(function(){var e=setInterval(function(){if(s(I.tokenms-Date.now()),i<1e3)try{e.clear()}catch(t){console.log("Tried to clear interval, could not. Oh well.")}},6e4)},[]);var u=Object(k.a)({url:"https://api.spotify.com/v1/me",method:"GET",headers:{Authorization:"Bearer "+t}}),m=Object(b.a)(u,1)[0],d=m.data,p=m.loading,g=m.error;p&&console.log("Loading user..."),d&&(I.name=d.display_name,I.id=d.id);return""!==I.id?l.a.createElement(G,{token:t}):g?l.a.createElement("div",null,l.a.createElement("p",null,"If you're seeing this, click this button, then refresh the page."),l.a.createElement(v.a,{variant:"contained",color:"primary",onClick:function(){localStorage.setItem("token","")}},"Clear Token")):l.a.createElement("div",null,l.a.createElement("p",null,"Loading..."))});a(206),a(207);function M(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}();return function(){var a,n=Object(m.a)(e);if(t){var l=Object(m.a)(this).constructor;a=Reflect.construct(n,arguments,l)}else a=n.apply(this,arguments);return Object(u.a)(this,a)}}var q=Object(p.a)({palette:{primary:{main:"#0a5e54"},secondary:{main:"#ede8e5"}}}),H=function(e){Object(s.a)(a,e);var t=M(a);function a(){var e;return Object(c.a)(this,a),(e=t.call(this)).state={token:null,item:{album:{images:[{url:""}]},name:"",artists:[{name:""}],duration_ms:0},is_playing:"Paused",progress_ms:0},e}return Object(i.a)(a,[{key:"componentDidMount",value:function(){var e=h.access_token||localStorage.getItem("token");h.access_token&&(I.tokenms=Date.now()+18e5),e&&(this.setState({token:e}),localStorage.setItem("token",e),I.token=e)}},{key:"clearLocalStorage",value:function(){localStorage.setItem("token","")}},{key:"render",value:function(){return l.a.createElement(g.a,{theme:q},l.a.createElement("header",null,l.a.createElement("div",{className:"App"},l.a.createElement("div",null,!this.state.token&&l.a.createElement("div",{className:"App-header"},l.a.createElement(y.a,{variant:"h1",component:"h1",style:{textShadow:"0px 5px 10px rgba(0,0,0,0.9)"}},"Playpasting Time"),l.a.createElement("a",{className:"btn btn--loginApp-link",href:"".concat("https://accounts.spotify.com/authorize","?client_id=").concat("149f235f7ad941419d900b585b05d9e3","&redirect_uri=").concat("https://brandoshizzle.github.io/Playpaster/","&scope=").concat(d.join("%20"),"&response_type=token&show_dialog=true")},"Login to Spotify")))),this.state.token&&l.a.createElement(L,{token:this.state.token})))}}]),a}(n.Component);o.a.render(l.a.createElement(H,null),document.getElementById("root"))}},[[107,1,2]]]);
//# sourceMappingURL=main.ee7011f3.chunk.js.map