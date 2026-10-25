const $ = id => document.getElementById(id);
let currentPath = "";
let entries = [];
let selected = null;
let history = [];
let historyIndex = -1;
let showSidebar = true;
let viewMode = "details";

function fmtSize(n) {
  if (n == null) return "";
  if (n < 1024) return n + " bytes";
  const units = ["KB", "MB", "GB", "TB"];
  let v = n / 1024, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return v.toFixed(v >= 10 ? 0 : 1) + " " + units[i];
}
function iconFor(item) {
  if (item.is_dir) return "📁";
  const ext = (item.name.split(".").pop() || "").toLowerCase();
  if (["png","jpg","jpeg","gif","bmp","webp","svg"].includes(ext)) return "🖼️";
  if (["zip","7z","rar","gz"].includes(ext)) return "🗜️";
  if (["exe","msi"].includes(ext)) return "⚙️";
  if (["txt","md","log"].includes(ext)) return "📄";
  return "📃";
}
function showError(message) { showDialog("AvaExplorer", `<p class="dialog-message">${escapeHtml(message)}</p><div class="dialog-actions"><button id="okBtn">OK</button></div>`); $("okBtn").onclick = closeDialog; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
async function navigate(path, addHistory=true) {
  const result = await window.pywebview.api.list_dir(path || undefined);
  if (!result.ok) return showError(result.error || "Unable to open folder.");
  currentPath = result.path;
  entries = result.items;
  selected = null;
  if (addHistory) {
    history = history.slice(0, historyIndex + 1);
    history.push(currentPath);
    historyIndex = history.length - 1;
  }
  $("address").value = currentPath;
  $("folderTitle").textContent = currentPath.split(/[\\/]/).filter(Boolean).pop() || currentPath;
  $("fileList").innerHTML = "";
  $("emptyState").hidden = entries.length !== 0;
  entries.forEach(item => {
    const row = document.createElement("div");
    row.className = "file-row";
    row.innerHTML = `<span class="file-name"><span class="file-icon">${iconFor(item)}</span>${escapeHtml(item.name)}</span><span>${fmtSize(item.size)}</span><span>${escapeHtml(item.type)}</span><span>${escapeHtml(item.modified)}</span>`;
    row.onclick = () => selectItem(item, row);
    row.ondblclick = () => openItem(item);
    row.oncontextmenu = e => { e.preventDefault(); selectItem(item, row); showItemMenu(e.clientX, e.clientY, item); };
    $("fileList").appendChild(row);
  });
  $("statusText").textContent = currentPath;
  $("itemCount").textContent = `${entries.length} object${entries.length === 1 ? "" : "s"}`;
  $("backBtn").disabled = historyIndex <= 0;
  $("forwardBtn").disabled = historyIndex >= history.length - 1;
  $("selectedDetails").textContent = "Select a file or folder to view its details.";
}
function selectItem(item, row) {
  selected = item;
  document.querySelectorAll(".file-row").forEach(el => el.classList.remove("selected"));
  row.classList.add("selected");
  $("selectedDetails").innerHTML = `<b>${escapeHtml(item.name)}</b><br>${escapeHtml(item.type)}<br>${item.is_dir ? "Folder" : "Size: " + fmtSize(item.size)}<br>Modified: ${escapeHtml(item.modified)}`;
}
async function openItem(item) {
  if (item.is_dir) return navigate(item.path);
  const result = await window.pywebview.api.open_item(item.path);
  if (!result.ok) showError(result.error || "Unable to open file.");
}
function showDialog(title, body) {
  $("dialogTitle").textContent = title;
  $("dialogBody").innerHTML = body;
  $("dialogShade").hidden = false;
}
function closeDialog() { $("dialogShade").hidden = true; }
function askName(title, label, initial, callback) {
  showDialog(title, `<label>${label}<input id="nameInput" value="${escapeHtml(initial || "")}" autofocus></label><div class="dialog-actions"><button id="cancelBtn">Cancel</button><button id="saveBtn">OK</button></div>`);
  $("cancelBtn").onclick = closeDialog;
  $("saveBtn").onclick = async () => { const value = $("nameInput").value; closeDialog(); await callback(value); };
  $("nameInput").focus(); $("nameInput").select();
  $("nameInput").onkeydown = e => { if (e.key === "Enter") $("saveBtn").click(); if (e.key === "Escape") closeDialog(); };
}
async function newFolder() {
  askName("Create New Folder", "Folder name:", "New Folder", async name => {
    const r = await window.pywebview.api.create_folder(currentPath, name);
    if (!r.ok) showError(r.error); else navigate(currentPath, false);
  });
}
async function renameSelected() {
  if (!selected) return showError("Select a file or folder first.");
  askName("Rename", "New name:", selected.name, async name => {
    const r = await window.pywebview.api.rename_item(selected.path, name);
    if (!r.ok) showError(r.error); else navigate(currentPath, false);
  });
}
async function deleteSelected() {
  if (!selected) return showError("Select a file or folder first.");
  showDialog("Confirm File Delete", `<p class="dialog-message">Are you sure you want to delete <b>${escapeHtml(selected.name)}</b>?<br><br>This action cannot be undone.</p><div class="dialog-actions"><button id="cancelBtn">Cancel</button><button id="deleteConfirm">Delete</button></div>`);
  $("cancelBtn").onclick = closeDialog;
  $("deleteConfirm").onclick = async () => {
    const r = await window.pywebview.api.delete_item(selected.path);
    closeDialog();
    if (!r.ok) showError(r.error); else navigate(currentPath, false);
  };
}
function showItemMenu(x, y, item) {
  showDialog("File Options", `<p class="dialog-message"><b>${escapeHtml(item.name)}</b></p><div class="dialog-actions"><button id="menuOpen">Open</button><button id="menuRename">Rename</button><button id="menuDelete">Delete</button><button id="menuCancel">Cancel</button></div>`);
  $("menuOpen").onclick = () => { closeDialog(); openItem(item); };
  $("menuRename").onclick = () => { closeDialog(); renameSelected(); };
  $("menuDelete").onclick = () => { closeDialog(); deleteSelected(); };
  $("menuCancel").onclick = closeDialog;
}
$("dialogClose").onclick = closeDialog;
$("newFolderBtn").onclick = newFolder;
$("renameBtn").onclick = renameSelected;
$("deleteBtn").onclick = deleteSelected;
$("goBtn").onclick = () => navigate($("address").value);
$("address").onkeydown = e => { if (e.key === "Enter") navigate($("address").value); };
$("upBtn").onclick = async () => { const r = await window.pywebview.api.parent_path(currentPath); if (r.ok) navigate(r.path); else showError(r.error); };
$("backBtn").onclick = () => { if (historyIndex > 0) { historyIndex--; navigate(history[historyIndex], false); } };
$("forwardBtn").onclick = () => { if (historyIndex < history.length - 1) { historyIndex++; navigate(history[historyIndex], false); } };
$("foldersBtn").onclick = () => { showSidebar = !showSidebar; document.querySelector(".sidebar").style.display = showSidebar ? "" : "none"; };
$("viewBtn").onclick = () => showDialog("Views", `<p class="dialog-message">Current view: Details</p><div class="dialog-actions"><button id="viewOk">OK</button></div>`);
$("searchBtn").onclick = () => askName("Search", "Find files whose name contains:", "", async query => {
  if (!query) return;
  const found = entries.filter(x => x.name.toLowerCase().includes(query.toLowerCase()));
  $("fileList").innerHTML = "";
  found.forEach(item => {
    const row = document.createElement("div"); row.className = "file-row";
    row.innerHTML = `<span class="file-name"><span class="file-icon">${iconFor(item)}</span>${escapeHtml(item.name)}</span><span>${fmtSize(item.size)}</span><span>${escapeHtml(item.type)}</span><span>${escapeHtml(item.modified)}</span>`;
    row.onclick = () => selectItem(item, row); row.ondblclick = () => openItem(item); $("fileList").appendChild(row);
  });
  $("emptyState").hidden = found.length !== 0;
  $("statusText").textContent = `Search results for "${query}" in current folder`;
});
document.querySelectorAll("[data-place]").forEach(btn => btn.onclick = async () => {
  const place = btn.dataset.place;
  if (place === "drives") {
    const drives = await window.pywebview.api.get_drives();
    $("fileList").innerHTML = "";
    drives.forEach(d => {
      const item = {name:d.name,path:d.path,type:"Drive",size:null,modified:"",is_dir:true};
      const row = document.createElement("div"); row.className = "file-row";
      row.innerHTML = `<span class="file-name"><span class="file-icon">💽</span>${escapeHtml(d.name)}</span><span></span><span>Drive</span><span></span>`;
      row.onclick = () => selectItem(item,row); row.ondblclick = () => navigate(d.path); $("fileList").appendChild(row);
    });
    $("folderTitle").textContent = "My Computer";
    $("statusText").textContent = `${drives.length} drives`;
    $("itemCount").textContent = `${drives.length} objects`;
    return;
  }
  const home = await window.pywebview.api.list_dir();
  let p = home.path;
  if (place === "desktop") p = p.replace(/[^\\/]+$/, "Desktop");
  if (place === "downloads") p = p.replace(/[^\\/]+$/, "Downloads");
  navigate(p);
});
window.addEventListener("pywebviewready", () => navigate());
