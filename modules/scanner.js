import { addScan, getState } from "./state.js";
import { showModal } from "./modal.js";

let html5Qrcode;
let cameraId;
let config;

export async function initScanner(readerId, scannerConfig) {
  config = scannerConfig;
  html5Qrcode = new Html5Qrcode(readerId, config);

  const cameras = await Html5Qrcode.getCameras();

  // 🔍 логируем каждую опцию поиска
  cameras.forEach((c) => {
    console.log("Camera obj:", c);
    console.log(c.label || "Без названия", {
      back: /back/i.test(c.label),
      rear: /rear/i.test(c.label),
      environment: /environment/i.test(c.label),
    });
  });

  document.getElementById("cameras_id").innerHTML = cameras
    .map(
      (c, index) => `
        <div style="margin-bottom:8px">
          <div><strong>Camera ${index + 1}</strong></div>
          <div>id: ${c.id}<div>
          <div>label: ${c.label || "Без названия"}</div>
        </div>
      `,
    )
    .join("");

  // 🖥 вывод на экран
  // document.getElementById("cameras_id").innerHTML = cameras
  //   .map((c) => {
  //     const label = c.label || "Без названия";
  //     return `
  //       <div style="margin-bottom:8px">
  //         <div><strong>${label}</strong></div>
  //         <div>back: ${c} ${/back/i.test(label) ? "✅" : "❌"}</div>
  //         <div>rear: ${/rear/i.test(label) ? "✅" : "❌"}</div>
  //         <div>environment: ${/environment/i.test(label) ? "✅" : "❌"}</div>
  //       </div>
  //     `;
  //   })
  //   .join("");

  // 🎯 выбор back-камеры
  const backCamera =
    cameras.find((c) => /back|rear|environment/i.test(c.label)) || cameras[0];

  cameraId = backCamera.id;

  document.getElementById("camera-in-use").textContent =
    `Camera: ${backCamera.label || "default"}`;

  startScanner();
}

export function startScanner() {
  html5Qrcode.start({ deviceId: cameraId }, config, onScanSuccess, onScanError);
}

export function stopScanner() {
  return html5Qrcode.stop();
}

function onScanSuccess(text, result) {
  console.log("onScanSuccess - start");

  if (result.result.format.formatName !== "DATA_MATRIX") return;

  const added = addScan(result.decodedText, result);
  if (!added) return;

  updateUI();
  stopScanner().then(showModal);
}

function onScanError(err) {
  console.warn("SCAN ERROR:", err);
}

function updateUI() {
  const { scannedSet, scannedIndex, count } = getState();

  document.getElementById("count_id").textContent = `Count: ${count}`;
  document.getElementById("set-size").textContent =
    `Set size: ${scannedSet.size}`;
  document.getElementById("set-info").textContent =
    `Set info:\n${[...scannedIndex.keys()].join("\n")}`;
}
