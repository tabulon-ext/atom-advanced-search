#!/usr/bin/env node
const help=()=>{console.log([["\n Atom Advanced Search","search, sort, and filtering tool for Atom apm packages"].join(" - "),["\n [USAGE]","apm-search [options] <name>"].join("\n   "),["\n [SELECT OPTIONS]",["  --select-packages","Get packages (default)"].join("\t"),["  --select-themes","Get themes"].join("\t"),["  --select-featured","Get featured packages/themes (ignores name argument)"].join("\t")].join("\n   "),["\n [SORT OPTIONS]",["  --sort-stars","Sort by stars (default)"].join("\t"),["  --sort-downloads","Sort by downloads"].join("\t")].join("\n   "),["\n [GENRAL OPTIONS]",["  --help       ","Show this help menu"].join("\t"),["  --verbose    ","Show more information"].join("\t"),["  --nocolor    ","Disable color printing on output"].join("\t"),["  --version    ","Output package version number"].join("\t")].join("\n   "),[""]].join("\n"))},__DEBUG__=!!process.env.NODE_DEBUG_LOGGING,debug=(...e)=>{__DEBUG__&&console.log(...e)},name="atom-advanced-search",version="1.0.3",pkgver=()=>{console.log([name,version].join(" v"))},defaults={verbose:!1,file:!1,sort:"stars",select:"packages",color:!0},parse_options=e=>{var o=process.env.PKG_OPTIONS||"{}";return e=Object.assign({},defaults,JSON.parse(o)),debug("Options set in environment variable:",process.env.PKG_OPTIONS,"Options: ",e),e},parse_arguments=e=>{var o={};if(debug("Args:",typeof e,e),!e||0===e.length)return!1;if(!Array.isArray(e))return"object"==typeof e&&Object.entries(e).length>0&&parse_options(e),!1;var s=e.shift();do{switch(debug("start loop",s),s){case __filename:debug("found this file, skipping",s),debug("next arg",s);break;case"--help":help(),debug("help",s),process.exit(0);break;case"--version":console.log([name,version].join(" v")),debug("version",s),process.exit(0);break;case"--verbose":o.verbose=!0,debug("verbose",s);break;case"--sort-stars":o.sort="stars",debug("stars",s);break;case"--nocolor":process.env.NOCOLOR=!0,o.color=!1,debug("color",s);break;case"--sort-downloads":o.sort="downloads",debug("downloads",s);break;case"--select-packages":o.select="packages",debug("stars",s);break;case"--select-themes":o.select="themes",debug("themes",s);break;case"--select-featured":o.select="featured",debug("featured",s);break;case"--file":s=e.shift()||!1,o.file=s,debug("file",s);break;default:s.match(/^--/)?(debug(`Notice: Argument '${s}' is unkown.`),debug("unknown",s)):void 0===s?debug("is undefined",s):s.length>0?(o.query=s,debug("is query",s)):debug("didnt match passing..",s),debug("----end loop----\n",s)}s=e.shift()}while(s);return debug("stopping",e,s),o},get_packages=(e,o)=>{const{execSync:s}=require("child_process");let t=["apm","featured"===o.select?"featured":"search","--json","themes"===o.select?"--themes":null,"featured"===o.select?null:e].join(" ");o.verbose&&console.log(t),debug("[GET_PACKAGES] query:",e),debug("[GET_PACKAGES] comand:",t),debug("[GET_PACKAGES] options:\n",o),console.log(["Searching apm (",o.select,") for:",e].join(" "));try{const e=s(t.toString()),o=Buffer.from(e).toString("UTF-8");return JSON.parse(o.trim())}catch(e){return console.error("exec error: ",e),e}},color=e=>{var o=require("tty"),s={bold:["1m","22m"],dim:["2m","22m"],italic:["3m","23m"],underline:["4m","24m"],inverse:["7m","27m"],black:["30m","39m"],red:["31m","39m"],green:["32m","39m"],yellow:["33m","39m"],blue:["34m","39m"],magenta:["35m","39m"],cyan:["36m","39m"],white:["37m","39m"],default:["39m","39m"],grey:["90m","39m"],bgBlack:["40m","49m"],bgRed:["41m","49m"],bgGreen:["42m","49m"],bgYellow:["43m","49m"],bgBlue:["44m","49m"],bgMagenta:["45m","49m"],bgCyan:["46m","49m"],bgWhite:["47m","49m"],bgDefault:["49m","49m"]};const t=e=>["[",e].join("");return process.env.COLORTERM||(console.log("COLORTERM environment variable not set, continuing to display with color."),console.log("Set NOCOLOR in the environment or --nocolor in the commandline if there are issues")),e=!process.env.NOCOLOR&&o.isatty(1)&&o.isatty(2),Object.keys(s).forEach((function(o){Object.defineProperty(String.prototype,o,{get:function(){return e?((e,o)=>[t(e[1]),t(e[0]),o,t(e[1])].join(""))(s[o],this):this},enumerable:!1})})),s},render=(e,o)=>{if(!e)return console.log("No packages listed"),!1;color(o.color);var s,t,r,n,a,i=process.stdout.columns||80,l=0,c=0,d=0,g=0;const u=e=>{var o=e.stargazers_count,s=e.downloads,t=e.name,r="0.0.0.0";r=e.metadata?e.metadata.version:e.version,parseInt(o)>l&&(l=parseInt(o)),parseInt(s)>c&&(c=parseInt(s)),t.length>d&&(d=t.length);var n=r?r.length:0;n>g&&(g=n)},m=(e,o)=>(u(e),u(o),parseInt(e.stargazers_count)<parseInt(o.stargazers_count)?1:-1),p=(e,o)=>(u(e),u(o),parseInt(e.downloads)<parseInt(o.downloads)?1:-1),f=["Stars","Downloads","Package","Description"].join(" "),b="-".padStart(f.length,"-"),h=e=>{if(!e.name)return!1;e.metadata&&(e.description=e.metadata.description,e.version=e.metadata.version);const r=e.name,a=(e.downloads||0).toString().padStart(t," "),l=(e.stargazers_count||0).toString().padStart(s," "),c=(e=>["(",e,")"].join(""))(e.version||"0.0.0"),d=(e.description||"undefined").slice(0,i-n-r.length);return["","downloads"===o.sort?l.default:l.yellow.bold,"downloads"===o.sort?a.yellow.bold:a.default,r.cyan.bold,c.dim.italic,d.white].join(" ")};a="downloads"===o.sort?e.sort(p):e.sort(m),s=l.toString().length,t=c.toString().length,n=8+s+t+(r=g),debug("MAX_LENGTH",i),debug("pad_stars, pad_downs, pad_name, pad_version",s,t,r),(e=>{var o=[];for(var s of(o.push(f.bold),o.push(b),e))o.push(h(s));console.log(o.join("\n"))})(a)},encoding="utf-8",process_file=async e=>{const{fs:o}=require("fs");var s;if(console.log("filename",e),!e)return!1;let t=process.env.INIT_CWD||".";console.log("base_dir",t);var r=[t,e].join("/");return console.log("filepath",r),await o.readFile(r,(e,o)=>{if(e)return console.log("Error reading from file",e,o),!1;s=Buffer.from(o).toString("utf-8")}),console.log("fildata",s),JSON.parse(s)},process_stream=e=>{const o=Buffer.from(e).toString("utf-8");debug("data",e);var s=parse_options(),t=process.argv;t.shift(),t[0]===__filename&&t.shift();var r=parse_arguments(t);debug("runtime_options",r),s=Object.assign({},s,r);try{var n=JSON.parse(o.trim())}catch(e){console.log("Error processing input data",e)}finally{render(n,s)}},main=()=>{var e,o=process.argv;o.shift(),o[0]===__filename&&o.shift();var s=parse_options(),t=parse_arguments(o);(s=Object.assign({},s,t)).verbose&&console.log("options",s),"featured"===s.select?e="":(e=s.query)||(help(),process.exit(0)),debug(s);var r=[];s.file?(r=process_file(s.file),console.log("packages")):r=get_packages(e,s),render(r,s)};if(debug("START"),process.stdin.isTTY)main();else{var data="";process.stdin.setEncoding("utf-8").on("readable",(function(){var e;for(debug("noiTTY");e=process.stdin.read();)data+=e})).on("end",(function(){data=data.replace(/\n$/,""),process_stream(data)}))}
