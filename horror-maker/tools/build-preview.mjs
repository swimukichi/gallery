// 本番ファイル（index.html / style.css / app.js / terms.html）から、
// claude.ai の Artifact 用の1枚HTMLを作る。生成部分はページ内のダミーに差し替える。
// 使い方: node tools/build-preview.mjs <出力パス>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rd = (f) => fs.readFileSync(path.join(root, f), "utf8");
const out = process.argv[2];
if (!out) throw new Error("出力パスを指定してください");

const index = rd("index.html");
const terms = rd("terms.html");
const css = rd("style.css");
const app = rd("app.js");

const body = index.split(/<body>/)[1].split(/<\/body>/)[0].replace(/<script src="app\.js"><\/script>/, "");
const termsBody = terms.split(/<div class="wrap doc">/)[1].split(/<\/div>\s*<\/body>/)[0].replace(/<footer>.*?<\/footer>/s, "");
const fonts = index.match(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/)[0];

const shim = `
(function(){
  var real=window.fetch, enc=new TextEncoder(), sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
  function json(o){return new Response(JSON.stringify(o),{status:200,headers:{"content-type":"application/json"}});}
  function plotFor(n,themeId){
    var t=(THEMES.find(function(x){return x[0]===themeId})||[])[1];
    return {title:"（ダミー）"+(t&&themeId!=="none"?t:"開かない扉"),logline:"プレビュー用のダミーのプロットです。本番ではAIが書きます。",
      intro:"導入のダミー。主人公は小さな違和感を覚える。",development:"展開のダミー。違和感は少しずつ強まる。",twist:"転換のダミー。前提が裏返る。",
      truth:"真相のダミー。最初から仕込まれていた。",ending:"結末のダミー。",
      chapters:Array.from({length:n},function(_,i){return {no:i+1,title:"ダミー章"+(i+1),summary:"第"+(i+1)+"章で起きることのダミー。"}})};
  }
  window.fetch=async function(url,init){
    if(typeof url!=="string"||url.indexOf("/api/")<0) return real.apply(this,arguments);
    var b=JSON.parse(init.body); await sleep(700);
    if(url.indexOf("/api/plot")>=0) return json({plot:plotFor(Number(b.options.chapters),b.themeId),token:"preview"});
    if(url.indexOf("/api/revise")>=0){var p=plotFor(state.plot.chapters.length,state.themeId);p.twist="転換のダミー（"+(REVISIONS.find(function(x){return x[0]===b.revisionId})||[])[1]+"で直しました）。";return json({plot:p,token:"preview"});}
    var no=b.chapterNo, para="第"+no+"章のダミー本文です。廊下の奥で、誰かが静かに扉を閉める音がした。わたしは振り返らなかった。";
    var text=[para,"",para,"",para].join("\\n");
    return new Response(new ReadableStream({async start(c){
      function ev(n,d){c.enqueue(enc.encode("event: "+n+"\\ndata: "+JSON.stringify(d)+"\\n\\n"));}
      for(var i=0;i<text.length;i+=10){await sleep(25);ev("content_block_delta",{type:"content_block_delta",index:0,delta:{type:"text_delta",text:text.slice(i,i+10)}});}
      ev("message_delta",{type:"message_delta",delta:{stop_reason:"end_turn"}});ev("hb_done",{token:"preview",truncated:false});c.close();}}),
      {status:200,headers:{"content-type":"text/event-stream"}});
  };
})();`;

const after = `
document.getElementById("save").onclick=function(){document.getElementById("st3").textContent="プレビューでは保存できません。本番では.txtで保存できます。コピーは使えます。";};
document.querySelectorAll('a[href="terms.html"]').forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();
  document.getElementById("mainView").hidden=true;document.getElementById("termsView").hidden=false;window.scrollTo(0,0);});});
document.getElementById("termsBack").onclick=function(e){e.preventDefault();document.getElementById("termsView").hidden=true;document.getElementById("mainView").hidden=false;window.scrollTo(0,0);};
`;

const html = `<title>怖話工房（プレビュー）</title>
${fonts}
<style>
${css}
.pv{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--stain);color:var(--paper);font-size:13px;line-height:1.5;padding:8px 16px;text-align:center}
body{padding:0}
</style>
<div class="pv">プレビュー版：生成はダミーです。本番ではAIが書きます。</div>
<div id="mainView">${body}</div>
<div id="termsView" hidden><div class="wrap doc">${termsBody}<footer><a href="#" id="termsBack">怖話工房にもどる</a></footer></div></div>
<script>${shim}</script>
<script>${app}</script>
<script>${after}</script>
`;
fs.writeFileSync(out, html);
console.log("wrote", out, (html.length / 1024).toFixed(1) + "KB");
