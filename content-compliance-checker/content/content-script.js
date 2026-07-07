// ============================================================
// Content Script - 注入到每个网页
// 负责：高亮违禁词、显示结果面板、处理页面文本
// ============================================================

let overlayEl = null;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "showResults") {
    showResultsPanel(msg.results, msg.text);
    highlightWords(msg.results);
  }
  if (msg.action === "showLimitReached") {
    showLimitDialog();
  }
  if (msg.action === "scanEditable") {
    scanActiveEditable();
  }
});

// 高亮违禁词
function highlightWords(results) {
  removeHighlights();
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  if (container.nodeType !== Node.TEXT_NODE) return;

  const text = container.textContent;
  const frag = document.createDocumentFragment();
  let lastIdx = 0;
  const sorted = results.filter(r=>r.start>=0).sort((a,b)=>a.start-b.start);

  for (const r of sorted) {
    if (r.start < lastIdx) continue;
    if (r.start > lastIdx) {
      frag.appendChild(document.createTextNode(text.slice(lastIdx, r.start)));
    }
    const mark = document.createElement("mark");
    mark.className = "cc-highlight cc-" + r.severity;
    mark.title = r.desc + "\n建议：" + (r.suggest || "删除");
    mark.textContent = text.slice(r.start, r.end);
    frag.appendChild(mark);
    lastIdx = r.end;
  }
  if (lastIdx < text.length) {
    frag.appendChild(document.createTextNode(text.slice(lastIdx)));
  }
  container.parentNode?.replaceChild(frag, container);
}

function removeHighlights() {
  document.querySelectorAll("mark.cc-highlight").forEach(m=>{
    const parent = m.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(m.textContent||""), m);
      parent.normalize();
    }
  });
}

// 显示结果面板
function showResultsPanel(results, originalText) {
  removeOverlay();
  const errors = results.filter(r=>r.severity==="error");
  const warnings = results.filter(r=>r.severity==="warning");

  overlayEl = document.createElement("div");
  overlayEl.id = "cc-overlay";
  overlayEl.innerHTML = `
    <div id="cc-panel">
      <div id="cc-header">
        <span>🔍 合规检测结果</span>
        <button id="cc-close">✕</button>
      </div>
      <div id="cc-summary">
        <span class="cc-badge cc-error">🔴 ${errors.length} 严重</span>
        <span class="cc-badge cc-warn">🟡 ${warnings.length} 警告</span>
        <span class="cc-badge cc-ok">${results.length===0?"✅ 未发现问题":"共"+results.length+"处"}</span>
      </div>
      <div id="cc-results">${renderResultList(results)}</div>
    </div>
  `;
  document.body.appendChild(overlayEl);

  overlayEl.querySelector("#cc-close").onclick = () => {
    removeHighlights();
    removeOverlay();
  };
}

function renderResultList(results) {
  if (results.length===0) return '<div class="cc-empty">🎉 未发现合规问题，内容安全！</div>';
  const grouped = {};
  for (const r of results) {
    if (!grouped[r.industryName]) grouped[r.industryName] = [];
    grouped[r.industryName].push(r);
  }
  return Object.entries(grouped).map(([name,items])=>`
    <div class="cc-group">
      <div class="cc-group-title">${items[0].icon} ${name}（${items.length}处）</div>
      ${items.map(r=>`
        <div class="cc-item cc-item-${r.severity}">
          <span class="cc-word">"${r.word}"</span>
          <span class="cc-severity">${r.severity==="error"?"🔴":"🟡"}</span>
          <div class="cc-desc">${r.desc}</div>
          ${r.suggest?`<div class="cc-suggest">💡 建议改为：${r.suggest}</div>`:""}
        </div>
      `).join("")}
    </div>
  `).join("");
}

function removeOverlay() {
  if (overlayEl) { overlayEl.remove(); overlayEl=null; }
}

// 扫描当前活跃的输入框
function scanActiveEditable() {
  const el = document.activeElement;
  if (!el || !(el.tagName==="TEXTAREA"||el.tagName==="INPUT"||el.isContentEditable)) {
    alert("请先点击要检测的输入框或文本框");
    return;
  }
  const text = el.value || el.textContent;
  if (!text.trim()) { alert("输入框为空"); return; }
  chrome.runtime.sendMessage({
    action:"scan",
    text,
    industries:["general","ecommerce","livestream","beauty","food","medical","finance","education"]
  }, (resp) => {
    if (resp && resp.results) showResultsPanel(resp.results, text);
  });
}

// 限制提示
function showLimitDialog() {
  const div = document.createElement("div");
  div.id = "cc-limit-dialog";
  div.innerHTML = `
    <div class="cc-limit-box">
      <h3>🔒 今日免费次数已用完</h3>
      <p>免费版每天可检测 3 次</p>
      <p>升级 Pro 版 ¥9.9/月 无限次检测</p>
      <button onclick="this.parentElement.parentElement.remove()">知道了</button>
    </div>
  `;
  document.body.appendChild(div);
}
