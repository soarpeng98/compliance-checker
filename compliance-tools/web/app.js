
// 行业选择
var selected = ["general"];

// 渲染行业标签
(function(){
  var tagsDiv = document.getElementById("tags");
  Object.entries(r).forEach(function(entry){
    var k = entry[0], v = entry[1];
    var el = document.createElement("span");
    el.className = "tag" + (k==="general"?" on":"");
    el.setAttribute("data-industry", k);
    el.textContent = v.i + " " + v.n;
    el.onclick = function(){
      el.classList.toggle("on");
      selected = [];
      document.querySelectorAll("#tags .tag.on").forEach(function(t){
        var ik = t.getAttribute("data-industry");
        if(ik) selected.push(ik);
      });
      if(selected.length===0){ selected=["general"]; el.classList.add("on"); }
    };
    tagsDiv.appendChild(el);
  });
})();

// 扫描
function doScan(){
  var text = document.getElementById("input").value.trim();
  var resDiv = document.getElementById("results");
  var status = document.getElementById("status");
  if(!text){ resDiv.innerHTML = '<div class="empty">请输入要检测的文本</div>'; status.textContent=""; return; }

  var inds = [];
  document.querySelectorAll("#tags .tag.on").forEach(function(t){
    var ik = t.getAttribute("data-industry");
    if(ik) inds.push(ik);
  });
  if(inds.length===0) inds.push("general");

  var results = [];
  for(var i=0; i<inds.length; i++){
    var rule = r[inds[i]]; if(!rule) continue;
    for(var j=0; j<rule.w.length; j++){
      var item = rule.w[j];
      var p = text.indexOf(item.w);
      while(p!==-1){
        results.push({w:item.w, s:item.s, g:item.g, d:item.d, ind:inds[i], iname:rule.n, icon:rule.i});
        p = text.indexOf(item.w, p+1);
      }
    }
  }

  // 保存供一键替换
  window._lastResults = results;
  window._lastText = text;

  var errors = results.filter(function(x){return x.s==="error"});
  var warnings = results.filter(function(x){return x.s==="warning"});
  status.textContent = "检测完成 · "+results.length+"处问题";

  if(results.length===0){
    resDiv.innerHTML = '<div class="empty">🎉 未发现合规问题，内容安全！</div>';
    return;
  }

  var grouped = {};
  for(var i=0; i<results.length; i++){
    var k = results[i].iname;
    if(!grouped[k]) grouped[k] = [];
    grouped[k].push(results[i]);
  }

  var html = '<div class="card"><div class="summary">';
  html += '<span class="badge badge-err">🔴 '+errors.length+' 严重</span>';
  html += '<span class="badge badge-warn">🟡 '+warnings.length+' 警告</span>';
  html += '</div>';

  var keys = Object.keys(grouped);
  for(var i=0; i<keys.length; i++){
    var name = keys[i], items = grouped[name];
    html += '<div style="margin-top:8px"><div style="padding:8px 0;font-weight:600;font-size:13px;color:#cbd5e1">'+items[0].icon+' '+name+'（'+items.length+'处）</div>';
    for(var j=0; j<items.length; j++){
      var rv = items[j];
      html += '<div class="result-item '+rv.s+'"><span class="result-word">"'+rv.w+'"</span><span>'+(rv.s==="error"?"🔴":"🟡")+'</span><span class="result-desc">'+rv.d+'</span>';
      if(rv.g) html += '<span class="result-suggest">💡 建议改为：'+rv.g+'</span>';
      html += '</div>';
    }
    html += '</div>';
  }
  html += '<div style="display:flex;gap:8px;margin-top:12px"><button onclick="applyFix()" style="flex:1;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;font-size:14px;font-weight:600;cursor:pointer">🔧 一键替换全部违禁词</button></div>';
  html += '<div id="fixed-text-area" style="display:none;margin-top:12px"><textarea id="fixed-output" readonly style="width:100%;height:120px;padding:12px;border-radius:10px;background:#0d2818;border:1px solid #10b981;color:#d1fae5;font-size:13px;font-family:inherit;resize:vertical;line-height:1.8"></textarea><button onclick="copyFixed()" style="margin-top:8px;width:100%;padding:10px;border:none;border-radius:8px;background:#1e293b;color:#e2e8f0;font-size:13px;cursor:pointer">📋 复制修正文案</button></div>';
  html += '</div>';
  resDiv.innerHTML = html;
}

// 一键替换
function applyFix(){
  var results = window._lastResults;
  var text = window._lastText;
  if(!results||!text) return;
  var sorted = results.slice().sort(function(a,b){return b.w.length - a.w.length});
  for(var i=0; i<sorted.length; i++){
    var rv = sorted[i];
    var repl = (rv.g && rv.g !== "删除") ? rv.g.split("/")[0].trim() : "";
    text = text.split(rv.w).join(repl);
  }
  text = text.replace(/\s+/g," ").trim();
  document.getElementById("fixed-output").value = text;
  document.getElementById("fixed-text-area").style.display = "block";
}

// 复制修正文案
function copyFixed(){
  var ta = document.getElementById("fixed-output");
  ta.select(); document.execCommand("copy");
  var btn = event.target;
  btn.textContent = "✅ 已复制！";
  setTimeout(function(){btn.textContent = "📋 复制修正文案"}, 2000);
}

// 快捷键 Ctrl+Enter
document.getElementById("input").addEventListener("keydown",function(e){
  if(e.ctrlKey&&e.key==="Enter") doScan();
});
