// ============================================================
// Background Service Worker
// 处理右键菜单、扫描调度、订阅管理
// ============================================================

try { importScripts("../rules/rule-db.js", "../utils/storage.js"); } catch(e) { console.error(e); }

// 安装时创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "check-compliance",
    title: "🔍 AI合规检测选中文本",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "check-compliance-page",
    title: "📄 检测整个输入框内容",
    contexts: ["editable"]
  });
});

// 点击右键菜单
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "check-compliance") {
    await handleScan(tab, info.selectionText);
  } else if (info.menuItemId === "check-compliance-page") {
    // 通知content script去读取输入框内容
    chrome.tabs.sendMessage(tab.id, { action:"scanEditable" });
  }
});

// 来自popup的扫描请求
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "scan") {
    handleScanText(msg.text, msg.industries).then(sendResponse);
    return true; // async
  }
  if (msg.action === "getRemaining") {
    Storage.getRemainingScans().then(n => sendResponse({remaining:n}));
    return true;
  }
  if (msg.action === "upgrade") {
    handleUpgrade().then(sendResponse);
    return true;
  }
  if (msg.action === "getSubscription") {
    Storage.getSubscription().then(s => sendResponse(s));
    return true;
  }
});

// 处理选中文本扫描
async function handleScan(tab, text) {
  const canScan = await Storage.canScan();
  if (!canScan) {
    chrome.tabs.sendMessage(tab.id, { action:"showLimitReached" });
    return;
  }
  const results = scanText(text, ["general","ecommerce","livestream"]);
  await Storage.recordScan();
  chrome.tabs.sendMessage(tab.id, { action:"showResults", results, text });
}

// 按行业扫描文本
function scanText(text, industries) {
  const results = [];
  for (const key of industries) {
    const rule = RULES[key];
    if (!rule) continue;
    for (const item of rule.words) {
      if (text.includes(item.word)) {
        // 找到所有出现位置
        let pos = text.indexOf(item.word);
        while (pos !== -1) {
          results.push({
            ...item, industry:key, industryName:rule.name, icon:rule.icon,
            start: pos, end: pos + item.word.length
          });
          pos = text.indexOf(item.word, pos + 1);
        }
      }
    }
  }
  return results;
}

// 升级处理
async function handleUpgrade() {
  const sub = await Storage.getSubscription();
  sub.plan = "pro";
  sub.expiresAt = new Date(Date.now()+30*86400000).toISOString();
  await Storage.setSubscription(sub);
  return { success:true, plan:"pro", expiresAt:sub.expiresAt };
}

async function handleScanText(text, industries) {
  const canScan = await Storage.canScan();
  if (!canScan) return { error:"limit", remaining:0 };
  const results = scanText(text, industries);
  await Storage.recordScan();
  const remaining = await Storage.getRemainingScans();
  return { results, remaining };
}
