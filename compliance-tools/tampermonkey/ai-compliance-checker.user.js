// ==UserScript==
// @name         AI内容合规检测 - 违禁词扫描器
// @name:zh-CN   AI内容合规检测 - 违禁词扫描器
// @namespace    https://github.com/xianyu-fanshen/compliance-checker
// @version      1.0.0
// @description  一键检测网页文案中的广告违禁词，覆盖广告法、美妆、食品、医疗、金融、教育、直播7大行业，120+规则，Ctrl+Shift+C呼出面板
// @description:zh-CN  一键检测网页文案中的广告违禁词，覆盖广告法、美妆、食品、医疗、金融、教育、直播7大行业，120+规则，Ctrl+Shift+C呼出面板
// @author       咸鱼翻身
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @homepageURL  https://github.com/xianyu-fanshen/compliance-checker
// @supportURL   https://github.com/xianyu-fanshen/compliance-checker/issues
// ==/UserScript==

(function() {
"use strict";

// ========== 规则数据库 ==========
const RULES = {
  general:{name:"通用广告法",icon:"⚖️",words:[
    {word:"最好",severity:"error",suggest:"优质 / 出色",desc:"广告法禁止使用绝对化用语"},
    {word:"最佳",severity:"error",suggest:"优秀 / 出众",desc:"广告法禁止使用绝对化用语"},
    {word:"第一",severity:"error",suggest:"领先",desc:"广告法禁止使用绝对化用语"},
    {word:"唯一",severity:"error",suggest:"独特",desc:"广告法禁止使用绝对化用语"},
    {word:"首个",severity:"error",suggest:"率先",desc:"广告法禁止使用绝对化用语"},
    {word:"首选",severity:"error",suggest:"推荐 / 热门",desc:"广告法禁止使用绝对化用语"},
    {word:"顶级",severity:"error",suggest:"优质 / 高端",desc:"广告法禁止使用绝对化用语"},
    {word:"最高",severity:"error",suggest:"较高",desc:"广告法禁止使用绝对化用语"},
    {word:"最低",severity:"error",suggest:"实惠",desc:"广告法禁止使用绝对化用语"},
    {word:"最具",severity:"error",suggest:"很有",desc:"广告法禁止使用绝对化用语"},
    {word:"绝对",severity:"error",suggest:"非常",desc:"广告法禁止使用绝对化用语"},
    {word:"百分百",severity:"error",suggest:"高比例",desc:"广告法禁止使用绝对化用语"},
    {word:"全网第一",severity:"error",suggest:"深受欢迎",desc:"广告法禁止使用绝对化用语"},
    {word:"销量第一",severity:"error",suggest:"销量领先",desc:"广告法禁止使用绝对化用语"},
    {word:"独一无二",severity:"error",suggest:"独具特色",desc:"广告法禁止使用绝对化用语"},
    {word:"万能",severity:"error",suggest:"多功能",desc:"广告法禁止使用绝对化用语"},
    {word:"国家级",severity:"error",suggest:"优质",desc:"非官方认证不得使用"},
    {word:"包治百病",severity:"error",suggest:"删除",desc:"严重违规"},
    {word:"永不复发",severity:"error",suggest:"删除",desc:"严重违规"},
    {word:"立竿见影",severity:"error",suggest:"效果明显",desc:"夸大宣传"},
  ]},
  beauty:{name:"美妆护肤",icon:"💄",words:[
    {word:"消炎",severity:"error",suggest:"舒缓",desc:"化妆品不得宣称医疗效果"},
    {word:"抗敏",severity:"error",suggest:"温和",desc:"化妆品不得宣称医疗效果"},
    {word:"修复",severity:"error",suggest:"修护",desc:"慎用医疗术语"},
    {word:"再生",severity:"error",suggest:"焕活",desc:"不得宣称医疗效果"},
    {word:"治愈",severity:"error",suggest:"改善",desc:"不得宣称医疗效果"},
    {word:"治疗",severity:"error",suggest:"改善",desc:"不得宣称医疗效果"},
    {word:"杀菌",severity:"error",suggest:"清洁",desc:"不得宣称医疗效果"},
    {word:"排毒",severity:"error",suggest:"净化",desc:"不得宣称医疗效果"},
    {word:"祛斑",severity:"error",suggest:"淡斑 / 匀净",desc:"特殊用途需备案"},
    {word:"祛痘",severity:"error",suggest:"控油 / 清痘",desc:"特殊用途需备案"},
    {word:"纯天然",severity:"warning",suggest:"天然成分",desc:"化妆品不可能100%纯天然"},
    {word:"医美级",severity:"error",suggest:"院线品质",desc:"不得宣称医疗级别"},
    {word:"药妆",severity:"error",suggest:"功效护肤",desc:"中国禁止药妆宣称"},
    {word:"干细胞",severity:"error",suggest:"删除",desc:"化妆品禁用干细胞宣称"},
    {word:"刷酸",severity:"error",suggest:"焕肤",desc:"平台禁用词"},
    {word:"水光",severity:"error",suggest:"水润",desc:"平台禁用词"},
  ]},
  food:{name:"食品保健",icon:"🍎",words:[
    {word:"治疗",severity:"error",suggest:"删除",desc:"食品不得宣称治疗功效"},
    {word:"抗癌",severity:"error",suggest:"删除",desc:"严重违规"},
    {word:"防癌",severity:"error",suggest:"删除",desc:"严重违规"},
    {word:"降血压",severity:"error",suggest:"删除",desc:"食品不得宣称医疗功效"},
    {word:"降血糖",severity:"error",suggest:"删除",desc:"食品不得宣称医疗功效"},
    {word:"排毒",severity:"error",suggest:"促进代谢",desc:"食品不得宣称排毒"},
    {word:"减肥",severity:"error",suggest:"体重管理",desc:"食品不得宣称减肥功效"},
    {word:"燃脂",severity:"error",suggest:"删除",desc:"食品不得宣称燃脂"},
    {word:"瘦身",severity:"error",suggest:"体态管理",desc:"食品不得宣称瘦身"},
    {word:"壮阳",severity:"error",suggest:"删除",desc:"严重违规"},
    {word:"延年益寿",severity:"error",suggest:"删除",desc:"夸大宣传"},
    {word:"抗衰老",severity:"error",suggest:"保持年轻态",desc:"食品不得宣称抗衰老"},
    {word:"0糖0脂0卡",severity:"warning",suggest:"低糖低脂",desc:"需有检测报告"},
  ]},
  medical:{name:"医疗健康",icon:"🏥",words:[
    {word:"根治",severity:"error",suggest:"有效治疗",desc:"禁止保证根治"},
    {word:"无副作用",severity:"error",suggest:"副作用小",desc:"药物不可能无副作用"},
    {word:"安全无毒",severity:"error",suggest:"安全性高",desc:"避免绝对安全宣称"},
    {word:"包治",severity:"error",suggest:"删除",desc:"禁止保证疗效"},
    {word:"祖传秘方",severity:"error",suggest:"删除",desc:"禁止以祖传名义宣传"},
    {word:"神医",severity:"error",suggest:"删除",desc:"禁止神化医生"},
    {word:"治愈率",severity:"error",suggest:"删除",desc:"禁止提治愈率"},
  ]},
  finance:{name:"金融理财",icon:"💰",words:[
    {word:"保本",severity:"error",suggest:"删除",desc:"理财产品不得承诺保本"},
    {word:"无风险",severity:"error",suggest:"低风险",desc:"投资不存在无风险"},
    {word:"零风险",severity:"error",suggest:"风险可控",desc:"投资不存在零风险"},
    {word:"稳赚不赔",severity:"error",suggest:"删除",desc:"严重违规"},
    {word:"收益翻倍",severity:"error",suggest:"可观收益",desc:"不得承诺收益倍数"},
    {word:"躺着赚钱",severity:"error",suggest:"轻松理财",desc:"误导性宣传"},
    {word:"一夜暴富",severity:"error",suggest:"删除",desc:"严重违规"},
    {word:"内幕消息",severity:"error",suggest:"删除",desc:"违法"},
  ]},
  education:{name:"教育培训",icon:"📚",words:[
    {word:"保过",severity:"error",suggest:"高通过率",desc:"不得承诺考试结果"},
    {word:"包过",severity:"error",suggest:"高效备考",desc:"不得承诺考试结果"},
    {word:"包拿证",severity:"error",suggest:"助你取证",desc:"不得承诺证书获取"},
    {word:"提分百分百",severity:"error",suggest:"显著提分",desc:"不得承诺提分幅度"},
    {word:"命题组",severity:"error",suggest:"删除",desc:"不得借命题组名义宣传"},
    {word:"原题押中",severity:"error",suggest:"考点覆盖",desc:"不得宣称押题"},
    {word:"零基础包会",severity:"error",suggest:"零基础可学",desc:"不得承诺学习结果"},
  ]},
  ecommerce:{name:"电商通用",icon:"🛒",words:[
    {word:"高仿",severity:"error",suggest:"删除",desc:"侵权"},
    {word:"A货",severity:"error",suggest:"删除",desc:"侵权"},
    {word:"跳楼价",severity:"error",suggest:"优惠价",desc:"平台禁用词"},
    {word:"血亏",severity:"error",suggest:"超值",desc:"平台禁用词"},
    {word:"原单",severity:"error",suggest:"品质优选",desc:"平台禁用词"},
  ]},
  livestream:{name:"直播带货",icon:"📱",words:[
    {word:"全网最低",severity:"error",suggest:"实惠价",desc:"违反广告法"},
    {word:"史低价",severity:"error",suggest:"超值价",desc:"平台禁用词"},
    {word:"破价",severity:"error",suggest:"惊喜价",desc:"平台禁用词"},
    {word:"绝对最低价",severity:"error",suggest:"好价入手",desc:"违反广告法"},
  ]}
};

// ========== 存储 & 配额 ==========
function today(){ return new Date().toISOString().slice(0,10); }
function getSub(){
  try { return JSON.parse(GM_getValue("cc-sub","{}")); } catch(e) { return {}; }
}
function setSub(s){ GM_setValue("cc-sub",JSON.stringify(s)); }
function canScan(){
  let s = getSub();
  if(s.date!==today()){ s.date=today();s.count=0;setSub(s); }
  if(s.pro) return true;
  return s.count < 3;
}
function recordScan(){
  let s = getSub();
  if(s.date!==today()){ s.date=today();s.count=0; }
  s.count++; setSub(s);
}
function remaining(){ let s=getSub(); if(s.pro) return "无限"; if(s.date!==today()) return 3; return Math.max(0,3-s.count); }

// ========== 检测引擎 ==========
function scanText(text, industries){
  const results = [];
  for(const key of industries){
    const rule = RULES[key];
    if(!rule) continue;
    for(const item of rule.words){
      let pos = text.indexOf(item.word);
      while(pos!==-1){
        results.push({...item, industry:key, industryName:rule.name, icon:rule.icon, start:pos, end:pos+item.word.length});
        pos = text.indexOf(item.word, pos+1);
      }
    }
  }
  return results;
}

// ========== UI：浮动触发按钮 ==========
function createFloatingBtn(){
  if(document.getElementById("cc-floating-btn")) return;
  const btn = document.createElement("div");
  btn.id = "cc-floating-btn";
  btn.innerHTML = "🛡️";
  btn.title = "AI合规检测 (Ctrl+Shift+C)";
  btn.onclick = togglePanel;
  document.body.appendChild(btn);
}
function togglePanel(){
  if(document.getElementById("cc-panel")){ removePanel();return; }
  showPanel();
}

// ========== UI：主面板 ==========
function showPanel(results){
  removePanel();
  const remainingScans = remaining();
  const panel = document.createElement("div");
  panel.id = "cc-panel";
  panel.innerHTML = `
    <div class="cc-panel-inner">
      <div class="cc-panel-header">
        <span>🛡️ AI内容合规检测</span>
        <div class="cc-panel-header-right">
          <span style="font-size:11px;color:#93c5fd;margin-right:12px">今日剩余：${remainingScans}次</span>
          <button class="cc-btn-close" onclick="document.getElementById('cc-panel').remove()">✕</button>
        </div>
      </div>
      <div class="cc-panel-body">
        <div class="cc-section">
          <label class="cc-label">检测行业</label>
          <div class="cc-tags" id="cc-industry-tags">
            ${Object.entries(RULES).map(([k,v])=>`<label class="cc-tag ${k==='general'?'cc-tag-on':''}"><input type="checkbox" value="${k}" ${k==='general'?'checked':''}> ${v.icon} ${v.name}</label>`).join("")}
          </div>
        </div>
        <div class="cc-section">
          <label class="cc-label">检测文本</label>
          <textarea id="cc-textarea" class="cc-textarea" placeholder="在此粘贴要检测的文案...&#10;&#10;💡 也可以先在网页上选中文本，再点 🛡️ 按钮自动填充"></textarea>
          <button id="cc-scan-btn" class="cc-btn-scan">🔍 开始检测</button>
        </div>
        <div id="cc-results"></div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // 如果有选中文本，自动填充
  const sel = window.getSelection().toString().trim();
  if(sel) document.getElementById("cc-textarea").value = sel;

  // 行业标签点击
  panel.querySelectorAll(".cc-tag").forEach(t=>{t.onclick=function(){this.classList.toggle("cc-tag-on");this.querySelector("input").checked=!this.querySelector("input").checked;};});

  // 扫描按钮
  document.getElementById("cc-scan-btn").onclick = function(){
    const text = document.getElementById("cc-textarea").value.trim();
    if(!text) return alert("请先输入要检测的文本");
    if(!canScan()){ showResultsInPanel(null, true); return; }
    const industries = [...panel.querySelectorAll("#cc-industry-tags input:checked")].map(c=>c.value);
    if(industries.length===0) industries.push("general");
    const results = scanText(text, industries);
    recordScan();
    showResultsInPanel(results, false);
    // 更新剩余次数
    panel.querySelector(".cc-panel-header-right span").textContent = "今日剩余："+remaining()+"次";
  };

  // 键盘快捷键关闭
  const escHandler = e => { if(e.key==="Escape"){ removePanel(); document.removeEventListener("keydown",escHandler); } };
  document.addEventListener("keydown", escHandler);

  if(results) showResultsInPanel(results, false);
}

function showResultsInPanel(results, isLimit){
  const div = document.getElementById("cc-results");
  if(!div) return;
  if(isLimit){
    div.innerHTML = `<div class="cc-empty">🔒 今日免费次数已用完<br><small>分享给朋友，解锁更多次数（即将推出）</small></div>`;
    return;
  }
  if(!results || results.length===0){
    div.innerHTML = `<div class="cc-empty">🎉 未发现合规问题，内容安全！</div>`;
    return;
  }
  const errors=results.filter(r=>r.severity==="error"), warnings=results.filter(r=>r.severity==="warning");
  const grouped={}; for(const r of results){ const k=r.industryName||"其他"; if(!grouped[k]) grouped[k]=[]; grouped[k].push(r); }
  div.innerHTML = `
    <div class="cc-summary">
      <span class="cc-badge cc-badge-err">🔴 ${errors.length} 严重</span>
      <span class="cc-badge cc-badge-warn">🟡 ${warnings.length} 警告</span>
    </div>
    ${Object.entries(grouped).map(([name,items])=>`
      <div class="cc-group">
        <div class="cc-group-hd">${items[0].icon} ${name}（${items.length}处）</div>
        ${items.map(r=>`
          <div class="cc-item cc-item-${r.severity}">
            <span class="cc-item-word">"${r.word}"</span>
            <span>${r.severity==="error"?"🔴":"🟡"}</span>
            <span class="cc-item-desc">${r.desc}</span>
            ${r.suggest?`<span class="cc-item-suggest">💡 ${r.suggest}</span>`:""}
          </div>
        `).join("")}
      </div>
    `).join("")}
  `;
}

function removePanel(){
  const p = document.getElementById("cc-panel");
  if(p) p.remove();
}

// ========== 样式注入 ==========
GM_addStyle(`
#cc-floating-btn {
  position:fixed; bottom:24px; right:24px; z-index:999999;
  width:52px; height:52px; border-radius:50%;
  background:linear-gradient(135deg,#2563eb,#7c3aed);
  color:#fff; font-size:24px; display:flex; align-items:center; justify-content:center;
  cursor:pointer; box-shadow:0 4px 20px rgba(99,102,241,.5);
  transition:transform .2s; user-select:none;
}
#cc-floating-btn:hover { transform:scale(1.1); }
#cc-panel {
  position:fixed; top:0; right:0; bottom:0; z-index:999998;
  width:400px; max-width:100vw; background:#0f172a; color:#e2e8f0;
  font-size:13px; font-family:"PingFang SC","Microsoft YaHei",sans-serif;
  box-shadow:-4px 0 24px rgba(0,0,0,.5); overflow-y:auto;
}
.cc-panel-header {
  display:flex; justify-content:space-between; align-items:center;
  padding:14px 16px; background:#1e293b; font-weight:600; font-size:15px;
  position:sticky; top:0; z-index:1;
}
.cc-panel-header-right { display:flex; align-items:center; }
.cc-btn-close { background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer; padding:4px 8px; border-radius:4px; }
.cc-btn-close:hover { background:#334155; color:#fff; }
.cc-section { padding:12px 16px; border-bottom:1px solid #1e293b; }
.cc-label { font-size:11px; color:#64748b; display:block; margin-bottom:8px; }
.cc-tags { display:flex; flex-wrap:wrap; gap:6px; }
.cc-tag { padding:5px 10px; border-radius:6px; font-size:12px; cursor:pointer; background:#1e293b; border:1px solid #334155; color:#94a3b8; user-select:none; }
.cc-tag-on { background:#1e3a5f; border-color:#3b82f6; color:#93c5fd; }
.cc-tag input { display:none; }
.cc-textarea { width:100%; height:120px; padding:10px; border-radius:8px; background:#1e293b; border:1px solid #334155; color:#e2e8f0; font-size:13px; font-family:inherit; resize:vertical; box-sizing:border-box; }
.cc-textarea:focus { outline:none; border-color:#3b82f6; }
.cc-textarea::placeholder { color:#475569; }
.cc-btn-scan { width:100%; margin-top:8px; padding:10px; border:none; border-radius:8px; background:#2563eb; color:#fff; font-size:14px; font-weight:600; cursor:pointer; }
.cc-btn-scan:hover { background:#1d4ed8; }
#cc-results { border-top:1px solid #1e293b; }
.cc-summary { padding:10px 16px; display:flex; gap:8px; }
.cc-badge { padding:3px 10px; border-radius:5px; font-size:11px; font-weight:500; }
.cc-badge-err { background:#7f1d1d; color:#fca5a5; }
.cc-badge-warn { background:#78350f; color:#fde68a; }
.cc-empty { padding:48px 16px; text-align:center; color:#475569; font-size:14px; }
.cc-empty small { font-size:11px; display:block; margin-top:8px; color:#334155; }
.cc-group { border-bottom:1px solid #1e293b; }
.cc-group-hd { padding:8px 16px; background:#1a2332; font-weight:600; font-size:12px; }
.cc-item { padding:8px 16px; border-bottom:1px solid #0f172a; display:flex; flex-wrap:wrap; gap:4px; align-items:center; }
.cc-item-error { border-left:3px solid #ef4444; }
.cc-item-warning { border-left:3px solid #f59e0b; }
.cc-item-word { font-weight:700; font-family:monospace; font-size:13px; }
.cc-item-desc { width:100%; font-size:11px; color:#94a3b8; }
.cc-item-suggest { width:100%; font-size:11px; color:#6ee7b7; }
`);

// ========== 键盘快捷键 Ctrl+Shift+C ==========
document.addEventListener("keydown",e=>{ if(e.ctrlKey&&e.shiftKey&&e.key==="C"){ e.preventDefault(); togglePanel(); } });

// ========== 注册Tampermonkey菜单 ==========
if(typeof GM_registerMenuCommand === "function"){
  GM_registerMenuCommand("🛡️ 合规检测面板 (Ctrl+Shift+C)", togglePanel);
  GM_registerMenuCommand("📊 查看今日剩余次数", ()=>{ alert("今日剩余检测次数："+remaining()); });
}

// ========== 初始化 ==========
createFloatingBtn();
console.log("🛡️ AI内容合规检测 已就绪 | 按 Ctrl+Shift+C 打开面板 | 今日剩余："+remaining()+"次");

})();
