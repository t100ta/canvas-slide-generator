var Ce=Object.defineProperty;var Te=(n,e,t)=>e in n?Ce(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var g=(n,e,t)=>Te(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();const $e=(n,e)=>{let t;return(...r)=>{clearTimeout(t),t=setTimeout(()=>n(...r),e)}},j=(n,e,t)=>Math.min(Math.max(n,e),t),Re=(n,e)=>Math.random()*(e-n)+n,Ie=n=>new Promise((e,t)=>{const r=new FileReader;r.onload=()=>{typeof r.result=="string"?e(r.result):t(new Error("Failed to read file as base64"))},r.onerror=()=>t(r.error),r.readAsDataURL(n)}),pe=n=>new Promise((e,t)=>{const r=new Image;r.onload=()=>e(r),r.onerror=()=>t(new Error(`Failed to load image: ${n}`)),r.src=n}),Ae=()=>({width:1280,height:720,contentWidth:960,contentHeight:720,marginX:160,marginY:0}),Ee=(n,e)=>{const t=n.getContext("2d");if(!t)throw new Error("Failed to get 2D context from canvas");const r=Ae();return n.width=r.width,n.height=r.height,t.imageSmoothingEnabled=!1,t.textBaseline="top",{canvas:n,ctx:t,config:r,theme:e,effects:{scanlines:!0,noise:!0,rgbOffset:!0,blur:!1,jitter:!0,level:"light"},animation:{time:0,noiseOffset:0,jitterX:0,jitterY:0,enabled:!0},navigation:{currentSlide:0,totalSlides:0,canGoNext:!1,canGoPrev:!1},transition:{type:"fade",duration:300,progress:0,isActive:!1},images:new Map}},Le=n=>{const{ctx:e,config:t,theme:r}=n;e.fillStyle=r.backgroundColor,e.fillRect(0,0,t.width,t.height);const i=r.backgroundColor==="#000000"?"#001100":r.backgroundColor==="#000011"?"#001122":r.backgroundColor==="#110800"?"#221100":r.backgroundColor==="#110011"?"#220022":"#333333";e.fillStyle=i,e.fillRect(0,0,t.marginX,t.height),e.fillRect(t.width-t.marginX,0,t.marginX,t.height),e.strokeStyle=r.secondaryColor,e.lineWidth=1;for(let s=0;s<t.marginX;s+=20)e.beginPath(),e.moveTo(s,0),e.lineTo(s,t.height),e.stroke(),e.beginPath(),e.moveTo(t.width-t.marginX+s,0),e.lineTo(t.width-t.marginX+s,t.height),e.stroke()},B=(n,e,t,r,i=24,s)=>{const{ctx:a,theme:o}=n,c=s||o.primaryColor;a.font=`${i}px ${o.font}`,a.fillStyle=c,a.textAlign="left",a.shadowColor=c,a.shadowBlur=2,a.shadowOffsetX=1,a.shadowOffsetY=1;const l=n.config.contentWidth-40,h=Me(a,e,l);let d=r;h.forEach(f=>{a.fillText(f,t,d),d+=i*1.2}),a.shadowColor="transparent",a.shadowBlur=0,a.shadowOffsetX=0,a.shadowOffsetY=0;const p=Math.max(...h.map(f=>a.measureText(f).width)),u=h.length*i*1.2;return{width:p,height:u}},De=async(n,e,t,r,i=400,s=300)=>{const{ctx:a,theme:o}=n;try{const c=await pe(e),l=Math.min(i/c.width,s/c.height,1),h=c.width*l,d=c.height*l,p=t+(i-h)/2;a.strokeStyle=o.primaryColor,a.lineWidth=2,a.strokeRect(p-2,r-2,h+4,d+4),a.drawImage(c,p,r,h,d),a.globalAlpha=.3,a.fillStyle=o.backgroundColor;for(let u=0;u<d;u+=4)a.fillRect(p,r+u,h,2);return a.globalAlpha=1,{width:h,height:d}}catch(c){return console.error("Failed to render image:",c),a.strokeStyle="#ff0000",a.lineWidth=2,a.strokeRect(t,r,i,s),a.fillStyle="#ff0000",a.font=`16px ${o.font}`,a.fillText("Image Load Error",t+10,r+20),{width:i,height:s}}},Pe=async(n,e)=>{const{config:t,theme:r}=n;let i=40;const s=t.marginX+20,a=t.contentWidth-40;for(const o of e.elements){switch(o.type){case"heading":const c=o.level===1?36:o.level===2?28:24,l=o.level===1?r.accentColor:r.primaryColor,h=B(n,o.content,s,i,c,l);i+=h.height+20;break;case"paragraph":const d=B(n,o.content,s,i,18,r.primaryColor);i+=d.height+15;break;case"list":if(o.items)for(const k of o.items){const w=B(n,`• ${k}`,s+20,i,16,r.primaryColor);i+=w.height+8}i+=10;break;case"image":if(o.src){const k=t.height-i-40,w=Math.min(k,300),y=await De(n,o.src,s,i,a,w);i+=y.height+20}break;case"code":const p=o.content.split(`
`),u=p.length*20+20;n.ctx.fillStyle=`${r.primaryColor}20`,n.ctx.fillRect(s,i,a,u),n.ctx.strokeStyle=r.primaryColor,n.ctx.lineWidth=1,n.ctx.strokeRect(s,i,a,u);let f=i+10;for(const k of p)B(n,k,s+10,f,14,r.accentColor),f+=20;i+=u+15;break;case"divider":n.ctx.strokeStyle=r.primaryColor,n.ctx.lineWidth=2,n.ctx.beginPath(),n.ctx.moveTo(s,i+10),n.ctx.lineTo(s+a,i+10),n.ctx.stroke(),i+=30;break}if(i>t.height-40)break}},ze=n=>{const{ctx:e,config:t,theme:r,navigation:i}=n,s=`${i.currentSlide+1} / ${i.totalSlides}`,a=16;e.font=`${a}px ${r.font}`,e.fillStyle=r.secondaryColor,e.textAlign="center";const o=t.width/2,c=t.height-30,l=e.measureText(s).width;e.fillStyle=`${r.backgroundColor}aa`,e.fillRect(o-l/2-10,c-5,l+20,a+10),e.fillStyle=r.secondaryColor,e.fillText(s,o,c),e.textAlign="left"},Me=(n,e,t)=>{const r=e.split(" "),i=[];let s="";for(const a of r){const o=s+(s?" ":"")+a;n.measureText(o).width>t&&s?(i.push(s),s=a):s=o}return s&&i.push(s),i};function J(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var I=J();function de(n){I=n}var D={exec:()=>null};function x(n,e=""){let t=typeof n=="string"?n:n.source;const r={replace:(i,s)=>{let a=typeof s=="string"?s:s.source;return a=a.replace(b.caret,"$1"),t=t.replace(i,a),r},getRegex:()=>new RegExp(t,e)};return r}var b={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:n=>new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}#`),htmlBeginRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}<(?:[a-z].*>|!--)`,"i")},Be=/^(?:[ \t]*(?:\n|$))+/,_e=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Fe=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,P=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Oe=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,K=/(?:[*+-]|\d{1,9}[.)])/,ue=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,fe=x(ue).replace(/bull/g,K).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ne=x(ue).replace(/bull/g,K).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),V=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,qe=/^[^\n]+/,ee=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Ge=x(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",ee).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Xe=x(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,K).getRegex(),G="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",te=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ze=x("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",te).replace("tag",G).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ge=x(V).replace("hr",P).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",G).getRegex(),je=x(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ge).getRegex(),ne={blockquote:je,code:_e,def:Ge,fences:Fe,heading:Oe,hr:P,html:Ze,lheading:fe,list:Xe,newline:Be,paragraph:ge,table:D,text:qe},ae=x("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",P).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",G).getRegex(),We={...ne,lheading:Ne,table:ae,paragraph:x(V).replace("hr",P).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ae).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",G).getRegex()},He={...ne,html:x(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",te).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:D,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:x(V).replace("hr",P).replace("heading",` *#{1,6} *[^
]`).replace("lheading",fe).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ye=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ue=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,me=/^( {2,}|\\)\n(?!\s*$)/,Qe=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,X=/[\p{P}\p{S}]/u,ie=/[\s\p{P}\p{S}]/u,xe=/[^\s\p{P}\p{S}]/u,Je=x(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,ie).getRegex(),ke=/(?!~)[\p{P}\p{S}]/u,Ke=/(?!~)[\s\p{P}\p{S}]/u,Ve=/(?:[^\s\p{P}\p{S}]|~)/u,et=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,be=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,tt=x(be,"u").replace(/punct/g,X).getRegex(),nt=x(be,"u").replace(/punct/g,ke).getRegex(),we="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",it=x(we,"gu").replace(/notPunctSpace/g,xe).replace(/punctSpace/g,ie).replace(/punct/g,X).getRegex(),rt=x(we,"gu").replace(/notPunctSpace/g,Ve).replace(/punctSpace/g,Ke).replace(/punct/g,ke).getRegex(),st=x("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,xe).replace(/punctSpace/g,ie).replace(/punct/g,X).getRegex(),at=x(/\\(punct)/,"gu").replace(/punct/g,X).getRegex(),ot=x(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),lt=x(te).replace("(?:-->|$)","-->").getRegex(),ct=x("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",lt).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),O=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,ht=x(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",O).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ye=x(/^!?\[(label)\]\[(ref)\]/).replace("label",O).replace("ref",ee).getRegex(),ve=x(/^!?\[(ref)\](?:\[\])?/).replace("ref",ee).getRegex(),pt=x("reflink|nolink(?!\\()","g").replace("reflink",ye).replace("nolink",ve).getRegex(),re={_backpedal:D,anyPunctuation:at,autolink:ot,blockSkip:et,br:me,code:Ue,del:D,emStrongLDelim:tt,emStrongRDelimAst:it,emStrongRDelimUnd:st,escape:Ye,link:ht,nolink:ve,punctuation:Je,reflink:ye,reflinkSearch:pt,tag:ct,text:Qe,url:D},dt={...re,link:x(/^!?\[(label)\]\((.*?)\)/).replace("label",O).getRegex(),reflink:x(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",O).getRegex()},H={...re,emStrongRDelimAst:rt,emStrongLDelim:nt,url:x(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},ut={...H,br:x(me).replace("{2,}","*").getRegex(),text:x(H.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},_={normal:ne,gfm:We,pedantic:He},E={normal:re,gfm:H,breaks:ut,pedantic:dt},ft={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},oe=n=>ft[n];function v(n,e){if(e){if(b.escapeTest.test(n))return n.replace(b.escapeReplace,oe)}else if(b.escapeTestNoEncode.test(n))return n.replace(b.escapeReplaceNoEncode,oe);return n}function le(n){try{n=encodeURI(n).replace(b.percentDecode,"%")}catch{return null}return n}function ce(n,e){const t=n.replace(b.findPipe,(s,a,o)=>{let c=!1,l=a;for(;--l>=0&&o[l]==="\\";)c=!c;return c?"|":" |"}),r=t.split(b.splitPipe);let i=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(b.slashPipe,"|");return r}function L(n,e,t){const r=n.length;if(r===0)return"";let i=0;for(;i<r&&n.charAt(r-i-1)===e;)i++;return n.slice(0,r-i)}function gt(n,e){if(n.indexOf(e[1])===-1)return-1;let t=0;for(let r=0;r<n.length;r++)if(n[r]==="\\")r++;else if(n[r]===e[0])t++;else if(n[r]===e[1]&&(t--,t<0))return r;return t>0?-2:-1}function he(n,e,t,r,i){const s=e.href,a=e.title||null,o=n[1].replace(i.other.outputLinkReplace,"$1");r.state.inLink=!0;const c={type:n[0].charAt(0)==="!"?"image":"link",raw:t,href:s,title:a,text:o,tokens:r.inlineTokens(o)};return r.state.inLink=!1,c}function mt(n,e,t){const r=n.match(t.other.indentCodeCompensation);if(r===null)return e;const i=r[1];return e.split(`
`).map(s=>{const a=s.match(t.other.beginningSpace);if(a===null)return s;const[o]=a;return o.length>=i.length?s.slice(i.length):s}).join(`
`)}var N=class{constructor(n){g(this,"options");g(this,"rules");g(this,"lexer");this.options=n||I}space(n){const e=this.rules.block.newline.exec(n);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(n){const e=this.rules.block.code.exec(n);if(e){const t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:L(t,`
`)}}}fences(n){const e=this.rules.block.fences.exec(n);if(e){const t=e[0],r=mt(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(n){const e=this.rules.block.heading.exec(n);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){const r=L(t,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(t=r.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(n){const e=this.rules.block.hr.exec(n);if(e)return{type:"hr",raw:L(e[0],`
`)}}blockquote(n){const e=this.rules.block.blockquote.exec(n);if(e){let t=L(e[0],`
`).split(`
`),r="",i="";const s=[];for(;t.length>0;){let a=!1;const o=[];let c;for(c=0;c<t.length;c++)if(this.rules.other.blockquoteStart.test(t[c]))o.push(t[c]),a=!0;else if(!a)o.push(t[c]);else break;t=t.slice(c);const l=o.join(`
`),h=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${l}`:l,i=i?`${i}
${h}`:h;const d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,s,!0),this.lexer.state.top=d,t.length===0)break;const p=s.at(-1);if(p?.type==="code")break;if(p?.type==="blockquote"){const u=p,f=u.raw+`
`+t.join(`
`),k=this.blockquote(f);s[s.length-1]=k,r=r.substring(0,r.length-u.raw.length)+k.raw,i=i.substring(0,i.length-u.text.length)+k.text;break}else if(p?.type==="list"){const u=p,f=u.raw+`
`+t.join(`
`),k=this.list(f);s[s.length-1]=k,r=r.substring(0,r.length-p.raw.length)+k.raw,i=i.substring(0,i.length-u.raw.length)+k.raw,t=f.substring(s.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:s,text:i}}}list(n){let e=this.rules.block.list.exec(n);if(e){let t=e[1].trim();const r=t.length>1,i={type:"list",raw:"",ordered:r,start:r?+t.slice(0,-1):"",loose:!1,items:[]};t=r?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=r?t:"[*+-]");const s=this.rules.other.listItemRegex(t);let a=!1;for(;n;){let c=!1,l="",h="";if(!(e=s.exec(n))||this.rules.block.hr.test(n))break;l=e[0],n=n.substring(l.length);let d=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,y=>" ".repeat(3*y.length)),p=n.split(`
`,1)[0],u=!d.trim(),f=0;if(this.options.pedantic?(f=2,h=d.trimStart()):u?f=e[1].length+1:(f=e[2].search(this.rules.other.nonSpaceChar),f=f>4?1:f,h=d.slice(f),f+=e[1].length),u&&this.rules.other.blankLine.test(p)&&(l+=p+`
`,n=n.substring(p.length+1),c=!0),!c){const y=this.rules.other.nextBulletRegex(f),S=this.rules.other.hrRegex(f),z=this.rules.other.fencesBeginRegex(f),M=this.rules.other.headingBeginRegex(f),Z=this.rules.other.htmlBeginRegex(f);for(;n;){const A=n.split(`
`,1)[0];let $;if(p=A,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),$=p):$=p.replace(this.rules.other.tabCharGlobal,"    "),z.test(p)||M.test(p)||Z.test(p)||y.test(p)||S.test(p))break;if($.search(this.rules.other.nonSpaceChar)>=f||!p.trim())h+=`
`+$.slice(f);else{if(u||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||z.test(d)||M.test(d)||S.test(d))break;h+=`
`+p}!u&&!p.trim()&&(u=!0),l+=A+`
`,n=n.substring(A.length+1),d=$.slice(f)}}i.loose||(a?i.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(a=!0));let k=null,w;this.options.gfm&&(k=this.rules.other.listIsTask.exec(h),k&&(w=k[0]!=="[ ] ",h=h.replace(this.rules.other.listReplaceTask,""))),i.items.push({type:"list_item",raw:l,task:!!k,checked:w,loose:!1,text:h,tokens:[]}),i.raw+=l}const o=i.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let c=0;c<i.items.length;c++)if(this.lexer.state.top=!1,i.items[c].tokens=this.lexer.blockTokens(i.items[c].text,[]),!i.loose){const l=i.items[c].tokens.filter(d=>d.type==="space"),h=l.length>0&&l.some(d=>this.rules.other.anyLine.test(d.raw));i.loose=h}if(i.loose)for(let c=0;c<i.items.length;c++)i.items[c].loose=!0;return i}}html(n){const e=this.rules.block.html.exec(n);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(n){const e=this.rules.block.def.exec(n);if(e){const t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:r,title:i}}}table(n){const e=this.rules.block.table.exec(n);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const t=ce(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],s={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===r.length){for(const a of r)this.rules.other.tableAlignRight.test(a)?s.align.push("right"):this.rules.other.tableAlignCenter.test(a)?s.align.push("center"):this.rules.other.tableAlignLeft.test(a)?s.align.push("left"):s.align.push(null);for(let a=0;a<t.length;a++)s.header.push({text:t[a],tokens:this.lexer.inline(t[a]),header:!0,align:s.align[a]});for(const a of i)s.rows.push(ce(a,s.header.length).map((o,c)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:s.align[c]})));return s}}lheading(n){const e=this.rules.block.lheading.exec(n);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(n){const e=this.rules.block.paragraph.exec(n);if(e){const t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(n){const e=this.rules.block.text.exec(n);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(n){const e=this.rules.inline.escape.exec(n);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(n){const e=this.rules.inline.tag.exec(n);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(n){const e=this.rules.inline.link.exec(n);if(e){const t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;const s=L(t.slice(0,-1),"\\");if((t.length-s.length)%2===0)return}else{const s=gt(e[2],"()");if(s===-2)return;if(s>-1){const o=(e[0].indexOf("!")===0?5:4)+e[1].length+s;e[2]=e[2].substring(0,s),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let r=e[2],i="";if(this.options.pedantic){const s=this.rules.other.pedanticHrefTitle.exec(r);s&&(r=s[1],i=s[3])}else i=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?r=r.slice(1):r=r.slice(1,-1)),he(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(n,e){let t;if((t=this.rules.inline.reflink.exec(n))||(t=this.rules.inline.nolink.exec(n))){const r=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=e[r.toLowerCase()];if(!i){const s=t[0].charAt(0);return{type:"text",raw:s,text:s}}return he(t,i,t[0],this.lexer,this.rules)}}emStrong(n,e,t=""){let r=this.rules.inline.emStrongLDelim.exec(n);if(!r||r[3]&&t.match(this.rules.other.unicodeAlphaNumeric))return;if(!(r[1]||r[2]||"")||!t||this.rules.inline.punctuation.exec(t)){const s=[...r[0]].length-1;let a,o,c=s,l=0;const h=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,e=e.slice(-1*n.length+s);(r=h.exec(e))!=null;){if(a=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!a)continue;if(o=[...a].length,r[3]||r[4]){c+=o;continue}else if((r[5]||r[6])&&s%3&&!((s+o)%3)){l+=o;continue}if(c-=o,c>0)continue;o=Math.min(o,o+c+l);const d=[...r[0]][0].length,p=n.slice(0,s+r.index+d+o);if(Math.min(s,o)%2){const f=p.slice(1,-1);return{type:"em",raw:p,text:f,tokens:this.lexer.inlineTokens(f)}}const u=p.slice(2,-2);return{type:"strong",raw:p,text:u,tokens:this.lexer.inlineTokens(u)}}}}codespan(n){const e=this.rules.inline.code.exec(n);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," ");const r=this.rules.other.nonSpaceChar.test(t),i=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return r&&i&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(n){const e=this.rules.inline.br.exec(n);if(e)return{type:"br",raw:e[0]}}del(n){const e=this.rules.inline.del.exec(n);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(n){const e=this.rules.inline.autolink.exec(n);if(e){let t,r;return e[2]==="@"?(t=e[1],r="mailto:"+t):(t=e[1],r=t),{type:"link",raw:e[0],text:t,href:r,tokens:[{type:"text",raw:t,text:t}]}}}url(n){let e;if(e=this.rules.inline.url.exec(n)){let t,r;if(e[2]==="@")t=e[0],r="mailto:"+t;else{let i;do i=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(i!==e[0]);t=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:t,href:r,tokens:[{type:"text",raw:t,text:t}]}}}inlineText(n){const e=this.rules.inline.text.exec(n);if(e){const t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},C=class Y{constructor(e){g(this,"tokens");g(this,"options");g(this,"state");g(this,"tokenizer");g(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||I,this.options.tokenizer=this.options.tokenizer||new N,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={other:b,block:_.normal,inline:E.normal};this.options.pedantic?(t.block=_.pedantic,t.inline=E.pedantic):this.options.gfm&&(t.block=_.gfm,this.options.breaks?t.inline=E.breaks:t.inline=E.gfm),this.tokenizer.rules=t}static get rules(){return{block:_,inline:E}}static lex(e,t){return new Y(t).lex(e)}static lexInline(e,t){return new Y(t).inlineTokens(e)}lex(e){e=e.replace(b.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){const r=this.inlineQueue[t];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],r=!1){for(this.options.pedantic&&(e=e.replace(b.tabCharGlobal,"    ").replace(b.spaceLine,""));e;){let i;if(this.options.extensions?.block?.some(a=>(i=a.call({lexer:this},e,t))?(e=e.substring(i.raw.length),t.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);const a=t.at(-1);i.raw.length===1&&a!==void 0?a.raw+=`
`:t.push(i);continue}if(i=this.tokenizer.code(e)){e=e.substring(i.raw.length);const a=t.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+i.raw,a.text+=`
`+i.text,this.inlineQueue.at(-1).src=a.text):t.push(i);continue}if(i=this.tokenizer.fences(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.heading(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.hr(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.blockquote(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.list(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.html(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.def(e)){e=e.substring(i.raw.length);const a=t.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+i.raw,a.text+=`
`+i.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title});continue}if(i=this.tokenizer.table(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.lheading(e)){e=e.substring(i.raw.length),t.push(i);continue}let s=e;if(this.options.extensions?.startBlock){let a=1/0;const o=e.slice(1);let c;this.options.extensions.startBlock.forEach(l=>{c=l.call({lexer:this},o),typeof c=="number"&&c>=0&&(a=Math.min(a,c))}),a<1/0&&a>=0&&(s=e.substring(0,a+1))}if(this.state.top&&(i=this.tokenizer.paragraph(s))){const a=t.at(-1);r&&a?.type==="paragraph"?(a.raw+=`
`+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(i),r=s.length!==e.length,e=e.substring(i.raw.length);continue}if(i=this.tokenizer.text(e)){e=e.substring(i.raw.length);const a=t.at(-1);a?.type==="text"?(a.raw+=`
`+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(i);continue}if(e){const a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let r=e,i=null;if(this.tokens.links){const o=Object.keys(this.tokens.links);if(o.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)o.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,i.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(i=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let s=!1,a="";for(;e;){s||(a=""),s=!1;let o;if(this.options.extensions?.inline?.some(l=>(o=l.call({lexer:this},e,t))?(e=e.substring(o.raw.length),t.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);const l=t.at(-1);o.type==="text"&&l?.type==="text"?(l.raw+=o.raw,l.text+=o.text):t.push(o);continue}if(o=this.tokenizer.emStrong(e,r,a)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.del(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),t.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),t.push(o);continue}let c=e;if(this.options.extensions?.startInline){let l=1/0;const h=e.slice(1);let d;this.options.extensions.startInline.forEach(p=>{d=p.call({lexer:this},h),typeof d=="number"&&d>=0&&(l=Math.min(l,d))}),l<1/0&&l>=0&&(c=e.substring(0,l+1))}if(o=this.tokenizer.inlineText(c)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(a=o.raw.slice(-1)),s=!0;const l=t.at(-1);l?.type==="text"?(l.raw+=o.raw,l.text+=o.text):t.push(o);continue}if(e){const l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return t}},q=class{constructor(n){g(this,"options");g(this,"parser");this.options=n||I}space(n){return""}code({text:n,lang:e,escaped:t}){const r=(e||"").match(b.notSpaceStart)?.[0],i=n.replace(b.endingNewline,"")+`
`;return r?'<pre><code class="language-'+v(r)+'">'+(t?i:v(i,!0))+`</code></pre>
`:"<pre><code>"+(t?i:v(i,!0))+`</code></pre>
`}blockquote({tokens:n}){return`<blockquote>
${this.parser.parse(n)}</blockquote>
`}html({text:n}){return n}heading({tokens:n,depth:e}){return`<h${e}>${this.parser.parseInline(n)}</h${e}>
`}hr(n){return`<hr>
`}list(n){const e=n.ordered,t=n.start;let r="";for(let a=0;a<n.items.length;a++){const o=n.items[a];r+=this.listitem(o)}const i=e?"ol":"ul",s=e&&t!==1?' start="'+t+'"':"";return"<"+i+s+`>
`+r+"</"+i+`>
`}listitem(n){let e="";if(n.task){const t=this.checkbox({checked:!!n.checked});n.loose?n.tokens[0]?.type==="paragraph"?(n.tokens[0].text=t+" "+n.tokens[0].text,n.tokens[0].tokens&&n.tokens[0].tokens.length>0&&n.tokens[0].tokens[0].type==="text"&&(n.tokens[0].tokens[0].text=t+" "+v(n.tokens[0].tokens[0].text),n.tokens[0].tokens[0].escaped=!0)):n.tokens.unshift({type:"text",raw:t+" ",text:t+" ",escaped:!0}):e+=t+" "}return e+=this.parser.parse(n.tokens,!!n.loose),`<li>${e}</li>
`}checkbox({checked:n}){return"<input "+(n?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:n}){return`<p>${this.parser.parseInline(n)}</p>
`}table(n){let e="",t="";for(let i=0;i<n.header.length;i++)t+=this.tablecell(n.header[i]);e+=this.tablerow({text:t});let r="";for(let i=0;i<n.rows.length;i++){const s=n.rows[i];t="";for(let a=0;a<s.length;a++)t+=this.tablecell(s[a]);r+=this.tablerow({text:t})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:n}){return`<tr>
${n}</tr>
`}tablecell(n){const e=this.parser.parseInline(n.tokens),t=n.header?"th":"td";return(n.align?`<${t} align="${n.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:n}){return`<strong>${this.parser.parseInline(n)}</strong>`}em({tokens:n}){return`<em>${this.parser.parseInline(n)}</em>`}codespan({text:n}){return`<code>${v(n,!0)}</code>`}br(n){return"<br>"}del({tokens:n}){return`<del>${this.parser.parseInline(n)}</del>`}link({href:n,title:e,tokens:t}){const r=this.parser.parseInline(t),i=le(n);if(i===null)return r;n=i;let s='<a href="'+n+'"';return e&&(s+=' title="'+v(e)+'"'),s+=">"+r+"</a>",s}image({href:n,title:e,text:t,tokens:r}){r&&(t=this.parser.parseInline(r,this.parser.textRenderer));const i=le(n);if(i===null)return v(t);n=i;let s=`<img src="${n}" alt="${t}"`;return e&&(s+=` title="${v(e)}"`),s+=">",s}text(n){return"tokens"in n&&n.tokens?this.parser.parseInline(n.tokens):"escaped"in n&&n.escaped?n.text:v(n.text)}},se=class{strong({text:n}){return n}em({text:n}){return n}codespan({text:n}){return n}del({text:n}){return n}html({text:n}){return n}text({text:n}){return n}link({text:n}){return""+n}image({text:n}){return""+n}br(){return""}},T=class U{constructor(e){g(this,"options");g(this,"renderer");g(this,"textRenderer");this.options=e||I,this.options.renderer=this.options.renderer||new q,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new se}static parse(e,t){return new U(t).parse(e)}static parseInline(e,t){return new U(t).parseInline(e)}parse(e,t=!0){let r="";for(let i=0;i<e.length;i++){const s=e[i];if(this.options.extensions?.renderers?.[s.type]){const o=s,c=this.options.extensions.renderers[o.type].call({parser:this},o);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(o.type)){r+=c||"";continue}}const a=s;switch(a.type){case"space":{r+=this.renderer.space(a);continue}case"hr":{r+=this.renderer.hr(a);continue}case"heading":{r+=this.renderer.heading(a);continue}case"code":{r+=this.renderer.code(a);continue}case"table":{r+=this.renderer.table(a);continue}case"blockquote":{r+=this.renderer.blockquote(a);continue}case"list":{r+=this.renderer.list(a);continue}case"html":{r+=this.renderer.html(a);continue}case"paragraph":{r+=this.renderer.paragraph(a);continue}case"text":{let o=a,c=this.renderer.text(o);for(;i+1<e.length&&e[i+1].type==="text";)o=e[++i],c+=`
`+this.renderer.text(o);t?r+=this.renderer.paragraph({type:"paragraph",raw:c,text:c,tokens:[{type:"text",raw:c,text:c,escaped:!0}]}):r+=c;continue}default:{const o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return r}parseInline(e,t=this.renderer){let r="";for(let i=0;i<e.length;i++){const s=e[i];if(this.options.extensions?.renderers?.[s.type]){const o=this.options.extensions.renderers[s.type].call({parser:this},s);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){r+=o||"";continue}}const a=s;switch(a.type){case"escape":{r+=t.text(a);break}case"html":{r+=t.html(a);break}case"link":{r+=t.link(a);break}case"image":{r+=t.image(a);break}case"strong":{r+=t.strong(a);break}case"em":{r+=t.em(a);break}case"codespan":{r+=t.codespan(a);break}case"br":{r+=t.br(a);break}case"del":{r+=t.del(a);break}case"text":{r+=t.text(a);break}default:{const o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return r}},W,F=(W=class{constructor(n){g(this,"options");g(this,"block");this.options=n||I}preprocess(n){return n}postprocess(n){return n}processAllTokens(n){return n}provideLexer(){return this.block?C.lex:C.lexInline}provideParser(){return this.block?T.parse:T.parseInline}},g(W,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"])),W),xt=class{constructor(...n){g(this,"defaults",J());g(this,"options",this.setOptions);g(this,"parse",this.parseMarkdown(!0));g(this,"parseInline",this.parseMarkdown(!1));g(this,"Parser",T);g(this,"Renderer",q);g(this,"TextRenderer",se);g(this,"Lexer",C);g(this,"Tokenizer",N);g(this,"Hooks",F);this.use(...n)}walkTokens(n,e){let t=[];for(const r of n)switch(t=t.concat(e.call(this,r)),r.type){case"table":{const i=r;for(const s of i.header)t=t.concat(this.walkTokens(s.tokens,e));for(const s of i.rows)for(const a of s)t=t.concat(this.walkTokens(a.tokens,e));break}case"list":{const i=r;t=t.concat(this.walkTokens(i.items,e));break}default:{const i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(s=>{const a=i[s].flat(1/0);t=t.concat(this.walkTokens(a,e))}):i.tokens&&(t=t.concat(this.walkTokens(i.tokens,e)))}}return t}use(...n){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return n.forEach(t=>{const r={...t};if(r.async=this.defaults.async||r.async||!1,t.extensions&&(t.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){const s=e.renderers[i.name];s?e.renderers[i.name]=function(...a){let o=i.renderer.apply(this,a);return o===!1&&(o=s.apply(this,a)),o}:e.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const s=e[i.level];s?s.unshift(i.tokenizer):e[i.level]=[i.tokenizer],i.start&&(i.level==="block"?e.startBlock?e.startBlock.push(i.start):e.startBlock=[i.start]:i.level==="inline"&&(e.startInline?e.startInline.push(i.start):e.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(e.childTokens[i.name]=i.childTokens)}),r.extensions=e),t.renderer){const i=this.defaults.renderer||new q(this.defaults);for(const s in t.renderer){if(!(s in i))throw new Error(`renderer '${s}' does not exist`);if(["options","parser"].includes(s))continue;const a=s,o=t.renderer[a],c=i[a];i[a]=(...l)=>{let h=o.apply(i,l);return h===!1&&(h=c.apply(i,l)),h||""}}r.renderer=i}if(t.tokenizer){const i=this.defaults.tokenizer||new N(this.defaults);for(const s in t.tokenizer){if(!(s in i))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;const a=s,o=t.tokenizer[a],c=i[a];i[a]=(...l)=>{let h=o.apply(i,l);return h===!1&&(h=c.apply(i,l)),h}}r.tokenizer=i}if(t.hooks){const i=this.defaults.hooks||new F;for(const s in t.hooks){if(!(s in i))throw new Error(`hook '${s}' does not exist`);if(["options","block"].includes(s))continue;const a=s,o=t.hooks[a],c=i[a];F.passThroughHooks.has(s)?i[a]=l=>{if(this.defaults.async)return Promise.resolve(o.call(i,l)).then(d=>c.call(i,d));const h=o.call(i,l);return c.call(i,h)}:i[a]=(...l)=>{let h=o.apply(i,l);return h===!1&&(h=c.apply(i,l)),h}}r.hooks=i}if(t.walkTokens){const i=this.defaults.walkTokens,s=t.walkTokens;r.walkTokens=function(a){let o=[];return o.push(s.call(this,a)),i&&(o=o.concat(i.call(this,a))),o}}this.defaults={...this.defaults,...r}}),this}setOptions(n){return this.defaults={...this.defaults,...n},this}lexer(n,e){return C.lex(n,e??this.defaults)}parser(n,e){return T.parse(n,e??this.defaults)}parseMarkdown(n){return(t,r)=>{const i={...r},s={...this.defaults,...i},a=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&i.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));s.hooks&&(s.hooks.options=s,s.hooks.block=n);const o=s.hooks?s.hooks.provideLexer():n?C.lex:C.lexInline,c=s.hooks?s.hooks.provideParser():n?T.parse:T.parseInline;if(s.async)return Promise.resolve(s.hooks?s.hooks.preprocess(t):t).then(l=>o(l,s)).then(l=>s.hooks?s.hooks.processAllTokens(l):l).then(l=>s.walkTokens?Promise.all(this.walkTokens(l,s.walkTokens)).then(()=>l):l).then(l=>c(l,s)).then(l=>s.hooks?s.hooks.postprocess(l):l).catch(a);try{s.hooks&&(t=s.hooks.preprocess(t));let l=o(t,s);s.hooks&&(l=s.hooks.processAllTokens(l)),s.walkTokens&&this.walkTokens(l,s.walkTokens);let h=c(l,s);return s.hooks&&(h=s.hooks.postprocess(h)),h}catch(l){return a(l)}}}onError(n,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,n){const r="<p>An error occurred:</p><pre>"+v(t.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(t);throw t}}},R=new xt;function m(n,e){return R.parse(n,e)}m.options=m.setOptions=function(n){return R.setOptions(n),m.defaults=R.defaults,de(m.defaults),m};m.getDefaults=J;m.defaults=I;m.use=function(...n){return R.use(...n),m.defaults=R.defaults,de(m.defaults),m};m.walkTokens=function(n,e){return R.walkTokens(n,e)};m.parseInline=R.parseInline;m.Parser=T;m.parser=T.parse;m.Renderer=q;m.TextRenderer=se;m.Lexer=C;m.lexer=C.lex;m.Tokenizer=N;m.Hooks=F;m.parse=m;m.options;m.setOptions;m.use;m.walkTokens;m.parseInline;T.parse;C.lex;m.setOptions({breaks:!0,gfm:!0});const kt=async n=>{const e=n.split(/^---\s*$/m).map(r=>r.trim()).filter(r=>r.length>0),t=[];for(let r=0;r<e.length;r++){const i=e[r],s=await bt(i);t.push({index:r,elements:s})}return{raw:n,slides:t}},bt=async n=>{const e=m.lexer(n),t=[];for(const r of e)switch(r.type){case"heading":t.push({type:"heading",level:r.depth,content:r.text});break;case"paragraph":if(r.text.match(/!\[([^\]]*)\]\(([^)]+)\)/g)){const a=r.text.split(/!\[([^\]]*)\]\(([^)]+)\)/);for(let o=0;o<a.length;o++)if(o%3===0&&a[o].trim())t.push({type:"paragraph",content:a[o].trim()});else if(o%3===2){const c=a[o-1]||"",l=a[o];t.push({type:"image",content:"",alt:c,src:l})}}else t.push({type:"paragraph",content:r.text});break;case"list":const s=r.items.map(a=>typeof a.text=="string"?a.text:a.text||"");t.push({type:"list",content:"",items:s});break;case"code":t.push({type:"code",content:r.text});break;case"hr":t.push({type:"divider",content:"---"});break;default:"text"in r&&typeof r.text=="string"&&t.push({type:"paragraph",content:r.text});break}return t},wt=async n=>{const e=await Ie(n),t=await pe(e);return{name:n.name,data:e,width:t.naturalWidth,height:t.naturalHeight}},yt=(n,e,t)=>{const i=`![${e.replace(/\.[^/.]+$/,"")}](${t})`;return n.trim()+`

`+i},vt=n=>{const{ctx:e,config:t,animation:r,effects:i}=n,s=i.level,a=s==="heavy"||s==="extreme",o=s==="extreme",c=o?.35:a?.25:.1,l=o?.15:a?.1:.05,h=o?1:a?2:3,d=o?2:a?1.5:1;e.globalCompositeOperation="multiply",e.globalAlpha=c+Math.sin(r.time*.01)*l,e.fillStyle="#000000";for(let p=0;p<t.height;p+=h){const u=Math.sin(r.time*.02+p*.01)*d;e.fillRect(0,p+u,t.width,1)}e.globalCompositeOperation="source-over",e.globalAlpha=1},St=n=>{const{ctx:e,config:t,animation:r,effects:i}=n,s=i.level,a=s==="heavy"||s==="extreme",o=s==="extreme",c=e.getImageData(0,0,t.width,t.height),l=c.data,h=o?.08:a?.05:.015,d=o?.05:a?.03:.01,p=h+Math.sin(r.time*.005)*d;for(let u=0;u<l.length;u+=4)if(Math.random()<p){const f=Re(-15,15);l[u]=j(l[u]+f,0,255),l[u+1]=j(l[u+1]+f,0,255),l[u+2]=j(l[u+2]+f,0,255)}e.putImageData(c,0,0)},Ct=n=>{const{ctx:e,config:t,animation:r,effects:i}=n,s=i.level,a=s==="heavy"||s==="extreme",o=s==="extreme",l=e.getImageData(0,0,t.width,t.height).data,h=new Uint8ClampedArray(l),d=o?8:a?5:3,p=o?6:a?3:2,u=Math.sin(r.time*.01)*d,f=Math.cos(r.time*.015)*p;for(let w=0;w<t.height;w++)for(let y=0;y<t.width;y++){const S=(w*t.width+y)*4,z=Math.max(0,Math.min(t.width-1,y-u)),M=Math.max(0,Math.min(t.height-1,w-f)),Z=(Math.floor(M)*t.width+Math.floor(z))*4,A=Math.max(0,Math.min(t.width-1,y+u)),$=Math.max(0,Math.min(t.height-1,w+f)),Se=(Math.floor($)*t.width+Math.floor(A))*4;h[S]=l[Z],h[S+1]=l[S+1],h[S+2]=l[Se+2],h[S+3]=l[S+3]}const k=new ImageData(h,t.width,t.height);e.putImageData(k,0,0)},Tt=n=>{const{animation:e,effects:t}=n;if(!n.effects.jitter)return;const r=t.level,i=r==="heavy"||r==="extreme",s=r==="extreme",a=s?1:i?.5:.2,o=s?.6:i?.3:.1;e.jitterX=Math.sin(e.time*.1)*a,e.jitterY=Math.cos(e.time*.13)*o},$t=n=>{n.animation.enabled&&(n.animation.time+=1,n.animation.noiseOffset=Math.sin(n.animation.time*.01)*10,Tt(n))},Rt=n=>{const{ctx:e}=n;e.save();const t=n.effects.level;if(t==="none"){e.restore();return}(t==="light"||t==="heavy"||t==="extreme")&&vt(n),(t==="light"||t==="heavy"||t==="extreme")&&St(n),(t==="heavy"||t==="extreme")&&Ct(n),It(n),e.restore()},It=n=>{const{ctx:e,config:t}=n,r=e.createRadialGradient(t.width/2,t.height/2,0,t.width/2,t.height/2,Math.max(t.width,t.height)/1.5);r.addColorStop(0,"rgba(0, 0, 0, 0)"),r.addColorStop(.7,"rgba(0, 0, 0, 0)"),r.addColorStop(1,"rgba(0, 0, 0, 0.4)"),e.fillStyle=r,e.fillRect(0,0,t.width,t.height)},Q=[{name:"Green Phosphor",font:"Courier New, monospace",primaryColor:"#00ff00",secondaryColor:"#00cc00",backgroundColor:"#000000",accentColor:"#00ffff"},{name:"Blue CRT",font:"Courier New, monospace",primaryColor:"#00aaff",secondaryColor:"#0088cc",backgroundColor:"#000011",accentColor:"#00ffff"},{name:"Amber Terminal",font:"Courier New, monospace",primaryColor:"#ffaa00",secondaryColor:"#cc8800",backgroundColor:"#110800",accentColor:"#ffff00"},{name:"Purple Neon",font:"Courier New, monospace",primaryColor:"#aa00ff",secondaryColor:"#8800cc",backgroundColor:"#110011",accentColor:"#ff00ff"},{name:"Pixel Perfect",font:'"Courier New", "Lucida Console", monospace',primaryColor:"#ffffff",secondaryColor:"#cccccc",backgroundColor:"#222222",accentColor:"#ff6600"}],At=n=>Q.find(e=>e.name===n)||Q[0],Et=n=>{const e=document.documentElement;e.style.setProperty("--primary-color",n.primaryColor),e.style.setProperty("--secondary-color",n.secondaryColor),e.style.setProperty("--background-color",n.backgroundColor),e.style.setProperty("--accent-color",n.accentColor),e.style.setProperty("--font-family",n.font)},Lt=async(n,e)=>{const{theme:t,effects:r}=n,i=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRT Slide Presentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${t.font};
            background: ${t.backgroundColor};
            color: ${t.primaryColor};
            overflow: hidden;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .presentation-container {
            position: relative;
            width: 100vw;
            height: 100vh;
        }

        .slide-canvas {
            border: 2px solid ${t.primaryColor};
            box-shadow: 0 0 20px ${t.primaryColor}40;
            background: ${t.backgroundColor};
            width: 100%;
            height: 100%;
        }
        
        .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid ${t.primaryColor};
            border-radius: 5px;
            padding: 10px 20px;
            display: flex;
            gap: 15px;
            align-items: center;
            font-size: 12px;
            color: ${t.secondaryColor};
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .controls.visible {
            opacity: 1;
            pointer-events: auto;
        }
        
        .slide-indicator {
            color: ${t.accentColor};
            font-weight: bold;
        }
        
        .info-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid ${t.primaryColor};
            border-radius: 5px;
            padding: 15px;
            max-width: 300px;
            display: none;
            font-size: 11px;
            line-height: 1.4;
        }
        
        .info-panel.visible {
            display: block;
        }
        
        .info-panel h3 {
            color: ${t.accentColor};
            margin-bottom: 10px;
        }
        
        .info-panel ul {
            list-style: none;
            padding-left: 0;
        }
        
        .info-panel li {
            margin: 5px 0;
            color: ${t.primaryColor};
        }
        
        .info-panel kbd {
            background: ${t.primaryColor}20;
            border: 1px solid ${t.primaryColor};
            border-radius: 3px;
            padding: 2px 5px;
            font-family: ${t.font};
            font-size: 10px;
        }
        
        @media (max-width: 768px) {
            .controls {
                bottom: 10px;
                padding: 5px 10px;
                font-size: 10px;
            }
            
            .info-panel {
                top: 10px;
                right: 10px;
                max-width: 250px;
                font-size: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        <canvas class="slide-canvas" id="slideCanvas" width="1280" height="720"></canvas>
    </div>
    
    <div class="controls">
        <span>Navigation: ← → (slides)</span>
        <span class="slide-indicator" id="slideIndicator">1 / ${e.slides.length}</span>
        <span>Press <kbd>I</kbd> for info</span>
    </div>
    
    <div class="info-panel" id="infoPanel">
        <h3>Keyboard Shortcuts</h3>
        <ul>
            <li><kbd>←</kbd> <kbd>→</kbd> Navigate slides</li>
            <li><kbd>Space</kbd> Toggle animation</li>
            <li><kbd>F</kbd> Fullscreen</li>
            <li><kbd>I</kbd> Toggle this panel</li>
            <li><kbd>D</kbd> Download image</li>
            <li><kbd>Esc</kbd> Close panels</li>
        </ul>
        
        <h3>Presentation Info</h3>
        <ul>
            <li>Total slides: ${e.slides.length}</li>
            <li>Theme: ${t.name}</li>
            <li>Effects: ${r.level}</li>
        </ul>
    </div>
    
    <script>
        // Embedded slide data
        const slideData = ${JSON.stringify(e)};
        const themeData = ${JSON.stringify(t)};
        const effectsData = ${JSON.stringify(r)};
        
        // Application state
        let currentSlide = 0;
        let animationEnabled = true;
        let animationId = null;
        
        // Get canvas and context
        const canvas = document.getElementById('slideCanvas');
        const ctx = canvas.getContext('2d');
        const controlsEl = document.querySelector('.controls');
        let controlsTimeout = null;

        function showControls() {
            controlsEl.classList.add('visible');
            if (controlsTimeout) clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
                controlsEl.classList.remove('visible');
            }, 2000);
        }

        canvas.addEventListener('mousemove', showControls);
        canvas.addEventListener('touchstart', showControls);
        canvas.addEventListener('mouseleave', () => controlsEl.classList.remove('visible'));
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            renderCurrentSlide();
            startAnimation();
            showControls();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    toggleAnimation();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'i':
                case 'I':
                    e.preventDefault();
                    toggleInfoPanel();
                    break;
                case 'd':
                case 'D':
                    e.preventDefault();
                    downloadCurrentSlide();
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeAllPanels();
                    break;
            }
        });
        
        function previousSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                renderCurrentSlide();
                updateSlideIndicator();
            }
        }
        
        function nextSlide() {
            if (currentSlide < slideData.slides.length - 1) {
                currentSlide++;
                renderCurrentSlide();
                updateSlideIndicator();
            }
        }
        
        function toggleAnimation() {
            animationEnabled = !animationEnabled;
            if (animationEnabled) {
                startAnimation();
            } else {
                stopAnimation();
            }
        }
        
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
        
        function toggleInfoPanel() {
            const panel = document.getElementById('infoPanel');
            panel.classList.toggle('visible');
        }
        
        function closeAllPanels() {
            const panel = document.getElementById('infoPanel');
            panel.classList.remove('visible');
        }
        
        function downloadCurrentSlide() {
            const link = document.createElement('a');
            link.download = \`slide-\${currentSlide + 1}.png\`;
            link.href = canvas.toDataURL();
            link.click();
        }
        
        function updateSlideIndicator() {
            const indicator = document.getElementById('slideIndicator');
            indicator.textContent = \`\${currentSlide + 1} / \${slideData.slides.length}\`;
        }
        
        function startAnimation() {
            if (animationId) return;
            
            let time = 0;
            const animate = () => {
                if (animationEnabled) {
                    time += 0.016; // ~60fps
                    renderCurrentSlide(time);
                    animationId = requestAnimationFrame(animate);
                }
            };
            
            animationId = requestAnimationFrame(animate);
        }
        
        function stopAnimation() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
        
        function renderCurrentSlide(time = 0) {
            const slide = slideData.slides[currentSlide];
            if (!slide) return;
            
            // Clear canvas
            ctx.fillStyle = themeData.backgroundColor;
            ctx.fillRect(0, 0, 1280, 720);
            
            // Draw side margins
            const marginColor = themeData.backgroundColor === '#000000' ? '#001100' : 
                               themeData.backgroundColor === '#000011' ? '#001122' :
                               themeData.backgroundColor === '#110800' ? '#221100' :
                               themeData.backgroundColor === '#110011' ? '#220022' : '#333333';
            
            ctx.fillStyle = marginColor;
            ctx.fillRect(0, 0, 160, 720);
            ctx.fillRect(1120, 0, 160, 720);
            
            // Render slide content (simplified)
            let y = 40;
            const leftPadding = 180;
            
            slide.elements.forEach(element => {
                switch (element.type) {
                    case 'heading':
                        const size = element.level === 1 ? 36 : element.level === 2 ? 28 : 24;
                        const color = element.level === 1 ? themeData.accentColor : themeData.primaryColor;
                        
                        ctx.font = \`\${size}px \${themeData.font}\`;
                        ctx.fillStyle = color;
                        ctx.fillText(element.content, leftPadding, y);
                        y += size * 1.5;
                        break;
                        
                    case 'paragraph':
                        ctx.font = \`18px \${themeData.font}\`;
                        ctx.fillStyle = themeData.primaryColor;
                        
                        // Simple word wrapping
                        const words = element.content.split(' ');
                        let line = '';
                        const maxWidth = 900;
                        
                        for (const word of words) {
                            const testLine = line + (line ? ' ' : '') + word;
                            const metrics = ctx.measureText(testLine);
                            
                            if (metrics.width > maxWidth && line) {
                                ctx.fillText(line, leftPadding, y);
                                y += 22;
                                line = word;
                            } else {
                                line = testLine;
                            }
                        }
                        
                        if (line) {
                            ctx.fillText(line, leftPadding, y);
                            y += 22;
                        }
                        
                        y += 15;
                        break;
                        
                    case 'list':
                        if (element.items) {
                            ctx.font = \`16px \${themeData.font}\`;
                            ctx.fillStyle = themeData.primaryColor;
                            
                            element.items.forEach(item => {
                                ctx.fillText(\`• \${item}\`, leftPadding + 20, y);
                                y += 20;
                            });
                        }
                        y += 10;
                        break;
                }
                
                if (y > 680) return; // Prevent overflow
            });
            
            // Apply CRT effects if enabled
            if (effectsData.level !== 'none') {
                applyCRTEffects(time);
            }
            
            // Render slide indicator
            if (slideData.slides.length > 1) {
                const indicatorText = \`\${currentSlide + 1} / \${slideData.slides.length}\`;
                ctx.font = \`16px \${themeData.font}\`;
                ctx.fillStyle = themeData.secondaryColor;
                ctx.textAlign = 'center';
                
                const textWidth = ctx.measureText(indicatorText).width;
                ctx.fillStyle = themeData.backgroundColor + 'aa';
                ctx.fillRect(640 - textWidth / 2 - 10, 685, textWidth + 20, 26);
                
                ctx.fillStyle = themeData.secondaryColor;
                ctx.fillText(indicatorText, 640, 690);
                ctx.textAlign = 'left';
            }
        }
        
        function applyCRTEffects(time) {
            const imageData = ctx.getImageData(0, 0, 1280, 720);
            const data = imageData.data;
            
            // Scanlines
            if (effectsData.scanlines) {
                const level = effectsData.level;
                const step = level === 'extreme' ? 1 : level === 'heavy' ? 2 : 3;
                const dim = level === 'extreme' ? 0.6 : level === 'heavy' ? 0.7 : 0.85;
                for (let y = 0; y < 720; y += step) {
                    for (let x = 0; x < 1280; x++) {
                        const index = (y * 1280 + x) * 4;
                        data[index] *= dim;     // R
                        data[index + 1] *= dim; // G
                        data[index + 2] *= dim; // B
                    }
                }
            }
            
            // Noise
            if (effectsData.noise) {
                const level = effectsData.level;
                const intensity = level === 'extreme' ? 0.35 : level === 'heavy' ? 0.25 : level === 'light' ? 0.08 : 0;
                for (let i = 0; i < data.length; i += 4) {
                    const noise = (Math.random() - 0.5) * intensity * 255;
                    data[i] += noise;     // R
                    data[i + 1] += noise; // G
                    data[i + 2] += noise; // B
                }
            }

            let finalImage = imageData;

            // RGB Offset
            if (effectsData.rgbOffset && (effectsData.level === 'heavy' || effectsData.level === 'extreme')) {
                const level = effectsData.level;
                const offsetScaleX = level === 'extreme' ? 8 : 5;
                const offsetScaleY = level === 'extreme' ? 6 : 3;
                const offsetX = Math.sin(time * 0.01) * offsetScaleX;
                const offsetY = Math.cos(time * 0.015) * offsetScaleY;

                const src = imageData.data;
                const out = new Uint8ClampedArray(src);
                
                for (let y = 0; y < 720; y++) {
                    for (let x = 0; x < 1280; x++) {
                        const i = (y * 1280 + x) * 4;
                        const rx = Math.max(0, Math.min(1279, Math.floor(x - offsetX)));
                        const ry = Math.max(0, Math.min(719, Math.floor(y - offsetY)));
                        const rIndex = (ry * 1280 + rx) * 4;

                        const bx = Math.max(0, Math.min(1279, Math.floor(x + offsetX)));
                        const by = Math.max(0, Math.min(719, Math.floor(y + offsetY)));
                        const bIndex = (by * 1280 + bx) * 4;

                        out[i] = src[rIndex];
                        out[i + 1] = src[i + 1];
                        out[i + 2] = src[bIndex + 2];
                        out[i + 3] = src[i + 3];
                    }
                }

                finalImage = new ImageData(out, 1280, 720);
            }

            ctx.putImageData(finalImage, 0, 0);
        }
    <\/script>
</body>
</html>`,s=new Blob([i],{type:"text/html"}),a=URL.createObjectURL(s),o=document.createElement("a");o.href=a,o.download="crt-slide-presentation.html",o.click(),URL.revokeObjectURL(a)},Dt=(n,e=300)=>({type:n,duration:e,progress:0,isActive:!1});class Pt{constructor(e){g(this,"renderCtx");g(this,"markdownContent",null);g(this,"animationId",null);g(this,"isFullscreen",!1);const t=Q[0];this.renderCtx=Ee(e,t),this.renderCtx.transition=Dt("fade",300),this.setupEventListeners(),this.loadSampleContent()}async loadSampleContent(){try{const t=await(await fetch("/sample.md")).text();await this.loadMarkdown(t)}catch(e){console.error("Failed to load sample content:",e),await this.loadMarkdown(`# Welcome to CRT Slide Generator

## Getting Started
Drop a Markdown file or use the file input to load your presentation.

---

## Features
- Multi-slide support
- Keyboard navigation
- Theme customization
- CRT effects`)}}setupEventListeners(){document.addEventListener("keydown",c=>{const l=c.target;if(!(l.tagName==="INPUT"||l.tagName==="TEXTAREA"||l.isContentEditable))switch(c.key){case"ArrowLeft":c.preventDefault(),this.previousSlide();break;case"ArrowRight":c.preventDefault(),this.nextSlide();break;case" ":c.preventDefault(),this.toggleAnimation();break;case"f":case"F":c.preventDefault(),this.toggleFullscreen();break}}),document.getElementById("markdownFile")?.addEventListener("change",c=>{const l=c.target.files?.[0];l&&this.loadMarkdownFile(l)}),document.getElementById("imageFile")?.addEventListener("change",c=>{const l=c.target.files?.[0];l&&this.loadImageFile(l)});const r=document.getElementById("markdownEditor");if(r){const c=$e(l=>{this.loadMarkdown(l)},300);r.addEventListener("input",l=>{c(l.target.value)})}document.getElementById("themeSelector")?.addEventListener("change",c=>{const l=c.target.value;this.changeTheme(l)}),document.getElementById("effectSelector")?.addEventListener("change",c=>{const l=c.target.value;this.changeEffectLevel(l)}),document.getElementById("exportHtmlBtn")?.addEventListener("click",()=>this.exportPresentation("html")),document.getElementById("toggleAnimationBtn")?.addEventListener("click",()=>this.toggleAnimation()),this.setupDragAndDrop()}setupDragAndDrop(){const e=document.getElementById("dropZone");document.addEventListener("dragover",t=>{t.preventDefault(),e?.classList.add("active")}),document.addEventListener("dragleave",t=>{document.contains(t.relatedTarget)||e?.classList.remove("active")}),document.addEventListener("drop",t=>{t.preventDefault(),e?.classList.remove("active");const r=t.dataTransfer?.files;if(r&&r.length>0){const i=r[0];i.type==="text/markdown"||i.name.endsWith(".md")||i.name.endsWith(".txt")?this.loadMarkdownFile(i):i.type.startsWith("image/")&&this.loadImageFile(i)}})}async loadMarkdownFile(e){try{const t=await e.text();await this.loadMarkdown(t)}catch(t){console.error("Failed to load markdown file:",t)}}async loadImageFile(e){try{const t=await wt(e),r=document.getElementById("markdownEditor");if(r){const i=yt(r.value,e.name,t.data);r.value=i,await this.loadMarkdown(i)}}catch(t){console.error("Failed to load image file:",t)}}async loadMarkdown(e){try{this.markdownContent=await kt(e),this.renderCtx.navigation.totalSlides=this.markdownContent.slides.length,this.renderCtx.navigation.currentSlide=0,this.updateNavigationState(),this.render()}catch(t){console.error("Failed to parse markdown:",t)}}updateNavigationState(){const e=this.renderCtx.navigation;e.canGoPrev=e.currentSlide>0,e.canGoNext=e.currentSlide<e.totalSlides-1}previousSlide(){this.renderCtx.navigation.canGoPrev&&(this.renderCtx.navigation.currentSlide--,this.updateNavigationState(),this.render())}nextSlide(){this.renderCtx.navigation.canGoNext&&(this.renderCtx.navigation.currentSlide++,this.updateNavigationState(),this.render())}changeTheme(e){const t=At(e);this.renderCtx.theme=t,Et(t),this.render()}changeEffectLevel(e){switch(this.renderCtx.effects.level=e,e){case"none":this.renderCtx.effects.scanlines=!1,this.renderCtx.effects.noise=!1,this.renderCtx.effects.rgbOffset=!1,this.renderCtx.effects.jitter=!1;break;case"light":this.renderCtx.effects.scanlines=!0,this.renderCtx.effects.noise=!0,this.renderCtx.effects.rgbOffset=!1,this.renderCtx.effects.jitter=!1;break;case"heavy":this.renderCtx.effects.scanlines=!0,this.renderCtx.effects.noise=!0,this.renderCtx.effects.rgbOffset=!0,this.renderCtx.effects.jitter=!0;break;case"extreme":this.renderCtx.effects.scanlines=!0,this.renderCtx.effects.noise=!0,this.renderCtx.effects.rgbOffset=!0,this.renderCtx.effects.jitter=!0;break}this.render()}toggleAnimation(){this.renderCtx.animation.enabled=!this.renderCtx.animation.enabled,this.renderCtx.animation.enabled?this.startAnimation():this.stopAnimation()}toggleFullscreen(){this.isFullscreen?(document.exitFullscreen?.(),this.isFullscreen=!1):(document.documentElement.requestFullscreen?.(),this.isFullscreen=!0)}startAnimation(){if(this.animationId)return;const e=()=>{this.renderCtx.animation.enabled&&($t(this.renderCtx),this.render(),this.animationId=requestAnimationFrame(e))};this.animationId=requestAnimationFrame(e)}stopAnimation(){this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}async render(){if(!this.markdownContent||this.markdownContent.slides.length===0)return;const e=this.markdownContent.slides[this.renderCtx.navigation.currentSlide];e&&(Le(this.renderCtx),await Pe(this.renderCtx,e),this.renderCtx.navigation.totalSlides>1&&ze(this.renderCtx),this.renderCtx.effects.level!=="none"&&Rt(this.renderCtx))}async exportPresentation(e){if(this.markdownContent)try{switch(e){case"html":await Lt(this.renderCtx,this.markdownContent);break;default:console.error("Unsupported export format:",e)}}catch(t){console.error("Export failed:",t)}}getCurrentSlideCount(){return this.markdownContent?.slides.length||0}getCurrentSlideIndex(){return this.renderCtx.navigation.currentSlide}}document.addEventListener("DOMContentLoaded",()=>{const n=document.getElementById("slideCanvas");if(n){const e=new Pt(n);e.startAnimation(),window.presentation=e}});
