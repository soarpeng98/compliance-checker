// ============================================================
// Popup JS - 弹窗交互逻辑
// ============================================================

// State
let selectedIndustries = ["general"];
let scanResults = [];

// Init
document.addEventListener("DOMContentLoaded", async () => {
  await loadSubscription();
  bindIndustryTags();
  bindScanButton();
  bindUpgradeButton();
});

// 加载订阅状态
async function loadSubscription() {
  chrome.runtime.sendMessage({ action:"getSubscription" }, (sub) => {
    if (!sub) return;
    const badge = document.getElementById("plan-badge");
    if (sub.plan === "pro") {
      badge.textContent = "Pro版";
      badge.className = "plan-badge pro";
      document.getElementById("scan-count").textContent = "无限次检测";
    } else {
      badge.textContent = "免费版";
      badge.className = "plan-badge free";
      const remaining = sub.scanDate===today() ? Math.max(0,3-sub.dailyScans) : 3;
      document.getElementById("scan-count").textContent = `今日剩余：${remaining}/3 次`;
    }
    if (sub.plan === "pro") {
      document.getElementById("upgrade-banner").style.display = "none";
    }
  });
}

// 行业标签点击
function bindIndustryTags() {
  document.querySelectorAll("#industry-tags .tag").forEach(tag => {
    tag.addEventListener("click", () => {
      const cb = tag.querySelector("input");
      cb.checked = !cb.checked;
      tag.classList.toggle("selected", cb.checked);
      selectedIndustries = [...document.querySelectorAll("#industry-tags input:checked")]
        .map(i => i.value);
    });
  });
}

// 扫描按钮
function bindScanButton() {
  document.getElementById("scan-btn").addEventListener("click", async () => {
    const text = document.getElementById("text-input").value.trim();
    if (!text) { showEmpty(); return; }
    const btn = document.getElementById("scan-btn");
    btn.disabled = true;
    btn.textContent = "检测中...";

    chrome.runtime.sendMessage({
      action:"scan", text, industries:selectedIndustries
    }, (resp) => {
      btn.disabled = false;
      btn.textContent = "🔍 开始检测";
      if (resp.error === "limit") {
        showLimitReached();
      } else {
        scanResults = resp.results || [];
        renderResults(scanResults);
        loadSubscription();
      }
    });
  });
}

// 升级按钮
function bindUpgradeButton() {
  document.getElementById("upgrade-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action:"upgrade" }, (resp) => {
      if (resp.success) {
        alert("🎉 升级成功！已是 Pro 版，无限次检测！");
        loadSubscription();
      }
    });
  });
}

// 渲染结果
function renderResults(results) {
  const container = document.getElementById("results-container");
  const summary = document.getElementById("results-summary");
  const list = document.getElementById("results-list");

  container.style.display = "block";
  const errors = results.filter(r=>r.severity==="error");
  const warnings = results.filter(r=>r.severity==="warning");

  summary.innerHTML = `
    <span class="result-badge result-err">🔴 ${errors.length} 严重</span>
    <span class="result-badge result-warn">🟡 ${warnings.length} 警告</span>
    ${results.length===0?'<span class="result-badge result-ok">✅ 通过</span>':''}
  `;

  if (results.length===0) {
    list.innerHTML = '<div class="res-empty">🎉 未发现合规问题，内容安全！</div>';
    return;
  }

  const grouped = {};
  for (const r of results) {
    const k = r.industryName || "其他";
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(r);
  }

  list.innerHTML = Object.entries(grouped).map(([name,items]) => `
    <div style="padding:6px 16px;background:#1a2332;font-size:12px;font-weight:600;border-bottom:1px solid #1e293b">
      ${items[0].icon||"📌"} ${name}（${items.length}处）
    </div>
    ${items.map(r=>`
      <div class="res-item res-item-${r.severity}">
        <span class="res-word">"${r.word}"</span>
        <span class="res-icon">${r.severity==="error"?"🔴":"🟡"}</span>
        <span class="res-desc">${r.desc}</span>
        ${r.suggest?`<span class="res-suggest">💡 建议：${r.suggest}</span>`:""}
      </div>
    `).join("")}
  `).join("");
}

function showEmpty() {
  const container = document.getElementById("results-container");
  container.style.display = "block";
  document.getElementById("results-summary").innerHTML = "";
  document.getElementById("results-list").innerHTML =
    '<div class="res-empty">请输入要检测的文本</div>';
}

function showLimitReached() {
  const container = document.getElementById("results-container");
  container.style.display = "block";
  document.getElementById("results-summary").innerHTML = "";
  document.getElementById("results-list").innerHTML = `
    <div class="res-empty">
      <p style="font-size:24px;margin-bottom:8px">🔒</p>
      <p>今日免费次数已用完（3/3）</p>
      <p style="font-size:11px;margin-top:6px;color:#64748b">升级Pro版 ¥9.9/月 · 无限次检测</p>
    </div>
  `;
}

function today() { return new Date().toISOString().slice(0,10); }
