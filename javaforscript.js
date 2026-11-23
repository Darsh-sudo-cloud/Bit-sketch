const N = 16, S = 24;
const cv = document.getElementById("art"), ctx = cv.getContext("2d", { willReadFrequently: true });
cv.style.width = cv.style.height = N * S + "px";
const $ = id => document.getElementById(id);
let color = "#e53935", tool = "brush", down = false;

const hex = n => n.toString(16).padStart(2, "0");
const bits = n => n.toString(2).padStart(8, "0");

// Red, green, blue, plus a few extras
const palette = ["#e53935", "#43a047", "#1e88e5", "#fdd835", "#8e24aa", "#fb8c00", "#00acc1", "#f5f5f5", "#212121"];
palette.forEach((col, i) => {
  const b = document.createElement("button");
  b.className = "swatch" + (i === 0 ? " on" : "");
  b.style.background = col;
  b.onclick = () => {
    color = col;
    document.querySelectorAll(".swatch").forEach(s => s.classList.remove("on"));
    b.classList.add("on");
    setTool("brush");
  };
  $("swatches").appendChild(b);
});

function cell(e) {
  const r = cv.getBoundingClientRect();
  const x = Math.floor((e.clientX - r.left) / r.width * N);
  const y = Math.floor((e.clientY - r.top) / r.height * N);
  return x >= 0 && y >= 0 && x < N && y < N ? { x, y } : null;
}

function paint(c) {
  if (tool === "eraser") ctx.clearRect(c.x, c.y, 1, 1);
  else { ctx.fillStyle = color; ctx.fillRect(c.x, c.y, 1, 1); }
}

function inspect(c) {
  const [r, g, b, a] = ctx.getImageData(c.x, c.y, 1, 1).data;
  $("info").innerHTML = `x ${c.x}, y ${c.y}<br>#${hex(r)}${hex(g)}${hex(b)} &nbsp; alpha ${a}<br><br>R ${bits(r)}<br>G ${bits(g)}<br>B ${bits(b)}<br>A ${bits(a)}`;
}

async function refresh() {
  const data = ctx.getImageData(0, 0, N, N).data;
  let out = "";
  for (let i = 0; i < data.length; i += 16)
    out += i.toString(16).padStart(4, "0") + "  " + Array.from(data.slice(i, i + 16), hex).join(" ") + "\n";
  $("dump").textContent = out;
  const digest = await crypto.subtle.digest("SHA-256", data);
  $("hash").textContent = Array.from(new Uint8Array(digest), hex).join("");
}

cv.addEventListener("pointerdown", e => { down = true; cv.setPointerCapture(e.pointerId); const c = cell(e); if (c) { paint(c); inspect(c); } });
cv.addEventListener("pointermove", e => { const c = cell(e); if (!c) return; if (down) paint(c); inspect(c); });
cv.addEventListener("pointerup", () => { down = false; refresh(); });

function setTool(t) {
  tool = t;
  $("brush").classList.toggle("on", t === "brush");
  $("eraser").classList.toggle("on", t === "eraser");
}
$("brush").onclick = () => setTool("brush");
$("eraser").onclick = () => setTool("eraser");
$("clear").onclick = () => { ctx.clearRect(0, 0, N, N); refresh(); };

refresh();