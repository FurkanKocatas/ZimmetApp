const assignmentsData = [];

const assignmentList = document.getElementById("assignmentList");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalForm = document.getElementById("modalForm");
const cancelButton = document.getElementById("cancelButton");
const exportButton = document.getElementById("exportButton");
const addAssignmentButton = document.getElementById("addAssignmentButton");
const qrAddButton = document.getElementById("qrAddButton");
const qrModal = document.getElementById("qrModal");
const qrVideo = document.getElementById("qrVideo");
const qrCanvas = document.getElementById("qrCanvas");
const qrCancelButton = document.getElementById("qrCancelButton");
const qrInputModal = document.getElementById("qrInputModal");
const qrInputForm = document.getElementById("qrInputForm");
const cancelQrInput = document.getElementById("cancelQrInput");
let qrStream;
let isScanning = false;

// Kullanıcı oturum kontrolü
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Eğer token yoksa giriş ekranına yönlendirilir
    }
});

// Çıkış yapma işlemi
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token"); // Token'ı temizle
    window.location.href = "login.html"; // Giriş ekranına yönlendir
});

// Render Assignments
function renderAssignments() {
    assignmentList.innerHTML = "";

    const table = document.createElement("table");
    table.classList.add("w-full", "table-auto", "border-collapse", "border", "border-gray-300", "mt-4");
    table.innerHTML = `
        <thead>
            <tr class="bg-gray-100">
                <th class="border border-gray-300 px-4 py-2">Kategori</th>
                <th class="border border-gray-300 px-4 py-2">Cihaz Adı</th>
                <th class="border border-gray-300 px-4 py-2">Seri Numarası</th>
                <th class="border border-gray-300 px-4 py-2">Kime Zimmetli</th>
                <th class="border border-gray-300 px-4 py-2">Aksiyon</th>
            </tr>
        </thead>
        <tbody>
            ${assignmentsData
                .map((item, index) => `
                    <tr>
                        <td class="border border-gray-300 px-4 py-2">${item.category || "Kategori Secilmedi"}</td>
                        <td class="border border-gray-300 px-4 py-2">${item.deviceName}</td>
                        <td class="border border-gray-300 px-4 py-2">${item.serial}</td>
                        <td class="border border-gray-300 px-4 py-2">${item.assignedTo || "—"}</td>
                        <td class="border border-gray-300 px-4 py-2">
                            <button class="editButton bg-blue-500 text-white px-2 py-1 rounded mr-2" data-index="${index}">Düzenle</button>
                            <button class="deleteButton bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">Sil</button>
                        </td>
                    </tr>
                `)
                .join("")}
        </tbody>
    `;
    assignmentList.appendChild(table);

    attachDynamicEventListeners(); // Attach events for dynamically added buttons
}

// Attach Event Listeners for Edit and Delete
function attachDynamicEventListeners() {
    document.querySelectorAll(".editButton").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            const item = assignmentsData[index];

            // Düzenleme modalını doldur
            modalTitle.textContent = "Zimmet Düzenle";
            modalContent.innerHTML = `
                <div>
                    <label class="block">Kategori:</label>
                    <select name="category" class="w-full border border-gray-300 rounded px-3 py-2">
                        <option value="Macbook Pro" ${item.category === "Macbook Pro" ? "selected" : ""}>Macbook Pro</option>
                        <option value="Macbook Air" ${item.category === "Macbook Air" ? "selected" : ""}>Macbook Air</option>
                        <option value="MSI Laptop" ${item.category === "MSI Laptop" ? "selected" : ""}>MSI Laptop</option>
                        <option value="Razer Mouse" ${item.category === "Razer Mouse" ? "selected" : ""}>Razer Mouse</option>
                        <option value="Razer Klavye" ${item.category === "Razer Klavye" ? "selected" : ""}>Razer Klavye</option>
                        <option value="Logitech Mouse" ${item.category === "Logitech Mouse" ? "selected" : ""}>Logitech Mouse</option>
                        <option value="Logitech Klavye" ${item.category === "Logitech Klavye" ? "selected" : ""}>Logitech Klavye</option>
                        <option value="JBL Kulaklik" ${item.category === "JBL Kulaklik" ? "selected" : ""}>JBL Kulaklik</option>
                        <option value="Cizim Tableti" ${item.category === "Cizim Tableti" ? "selected" : ""}>Cizim Tableti</option>
                    </select>
                </div>
                <div>
                    <label class="block">Cihaz Adı:</label>
                    <input type="text" name="deviceName" class="w-full border border-gray-300 rounded px-3 py-2" value="${item.deviceName}">
                </div>
                <div>
                    <label class="block">Seri Numarası:</label>
                    <input type="text" name="serial" class="w-full border border-gray-300 rounded px-3 py-2" value="${item.serial}">
                </div>
                <div>
                    <label class="block">Kime Zimmetli:</label>
                    <input type="text" name="assignedTo" class="w-full border border-gray-300 rounded px-3 py-2" value="${item.assignedTo}">
                </div>`;
            
            modalForm.onsubmit = function (event) {
                event.preventDefault();
                const formData = new FormData(modalForm);
                assignmentsData[index] = {
                    category: formData.get("category"),
                    deviceName: formData.get("deviceName"),
                    serial: formData.get("serial"),
                    assignedTo: formData.get("assignedTo"),
                };
                renderAssignments();
                modal.classList.add("hidden");
            };

            modal.classList.remove("hidden");
        });
    });

    document.querySelectorAll(".deleteButton").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            assignmentsData.splice(index, 1); // Seçili zimmeti sil
            renderAssignments(); // Tabloyu güncelle
        });
    });
}

// Add Assignment Modal
addAssignmentButton.addEventListener("click", () => {
    modalTitle.textContent = "Yeni Zimmet Ekle";
    modalContent.innerHTML = `
        <div>
            <label class="block">Kategori:</label>
            <select name="category" class="w-full border border-gray-300 rounded px-3 py-2">
                <option value="Macbook Pro">Macbook Pro</option>
                <option value="Macbook Air">Macbook Air</option>
                <option value="MSI Laptop">MSI Laptop</option>
                <option value="Razer Mouse">Razer Mouse</option>
                <option value="Razer Klavye">Razer Klavye</option>
                <option value="Logitech Mouse">Logitech Mouse</option>
                <option value="Logitech Klavye">Logitech Klavye</option>
                <option value="JBL Kulaklik">JBL Kulaklik</option>
                <option value="Cizim Tableti">Cizim Tableti</option>
            </select>
        </div>
        <div>
            <label class="block">Cihaz Adı:</label>
            <input type="text" name="deviceName" class="w-full border border-gray-300 rounded px-3 py-2">
        </div>
        <div>
            <label class="block">Seri Numarası:</label>
            <input type="text" name="serial" class="w-full border border-gray-300 rounded px-3 py-2">
        </div>
        <div>
            <label class="block">Kime Zimmetli:</label>
            <input type="text" name="assignedTo" class="w-full border border-gray-300 rounded px-3 py-2">
        </div>`;
    modalForm.onsubmit = addAssignment;
    modal.classList.remove("hidden");
});

// Add Assignment
function addAssignment(event) {
    event.preventDefault(); // Prevent page reload

    const formData = new FormData(modalForm);
    assignmentsData.push({
        category: formData.get("category"),
        deviceName: formData.get("deviceName"),
        serial: formData.get("serial"),
        assignedTo: formData.get("assignedTo"),
    });

    renderAssignments(); // Update the assignments table
    modal.classList.add("hidden"); // Close the modal
    modalForm.reset(); // Reset the form fields
}

// QR Scanner
// QR Add Button - Open QR Modal
qrAddButton.addEventListener("click", () => {
    stopQRScanner(); // Önce kamerayı durdur
    resetQRInputModal(); // Formu sıfırla
    qrModal.classList.remove("hidden"); // QR modalını aç
    startQRScanner(); // Kamerayı başlat
});

// Reset QR Input Modal
function resetQRInputModal() {
    // Clear all input fields in the QR Input Modal
    document.getElementById("serialNumber").value = ""; // Clear serial number
    document.getElementById("deviceName").value = ""; // Clear device name
    document.getElementById("assignedTo").value = ""; // Clear zimmetlenen kisi
    const qrCategory = document.getElementById("qrCategory");
    if (qrCategory) {
        qrCategory.value = ""; // Reset category dropdown to default
    }

    // Hide the QR Input Modal
    qrInputModal.classList.add("hidden");

    // Reset scanning state
    isScanning = false;
}

qrInputForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    const category = document.getElementById("qrCategory").value.trim();
    const serialNumber = document.getElementById("serialNumber").value.trim();
    const deviceName = document.getElementById("deviceName").value.trim();
    const assignedTo = document.getElementById("assignedTo").value.trim();

    if (category && serialNumber && deviceName) {
        assignmentsData.push({
            category,
            deviceName,
            serial: serialNumber,
            assignedTo: assignedTo || "",
        });

        renderAssignments(); // Update the assignments table
        qrInputModal.classList.add("hidden"); // Close the QR Input modal
        resetQRInputModal(); // Reset the QR input modal
        qrModal.classList.add("hidden"); // Close the QR scanner modal
        this.reset(); // Reset the form fields
    } else {
        alert("Lütfen tüm gerekli alanları doldurun.");
    }
});

function startQRScanner() {
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            qrStream = stream;
            qrVideo.srcObject = stream;
            qrVideo.play();
            handleQRScan();
        })
        .catch(err => {
            console.error("Camera access denied:", err);
            alert("Kamera erişimi başarısız oldu.");
        });
}

function handleQRScan() {
    if (!isScanning) {
        const ctx = qrCanvas.getContext("2d");
        ctx.drawImage(qrVideo, 0, 0, qrCanvas.width, qrCanvas.height);
        const imageData = ctx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
        const code = jsQR(imageData.data, qrCanvas.width, qrCanvas.height);

        if (code) {
            isScanning = true;
            stopQRScanner();

            // Get and clean the QR data
            let qrData = code.data.trim();
            
            // Remove "Seri Numarası:" if it exists in the QR code data
            if (qrData.startsWith("Seri Numarası:")) {
                qrData = qrData.replace("Seri Numarası:", "").trim();
            }

            // Populate the serial number input field
            const serialNumberInput = document.getElementById("serialNumber");
            serialNumberInput.value = qrData; 
            serialNumberInput.placeholder = ""; // Clear placeholder text

            // Add dropdown to select category in QR Input modal
            const categoryDropdown = `
                <label for="category" class="block text-gray-700">Kategori:</label>
                <select id="qrCategory" name="category" class="w-full border border-gray-300 rounded px-3 py-2">
                    <option value="">Kategori Seçin</option>
                    <option value="Macbook Pro">Macbook Pro</option>
                    <option value="Macbook Air">Macbook Air</option>
                    <option value="MSI Laptop">MSI Laptop</option>
                    <option value="Razer Mouse">Razer Mouse</option>
                    <option value="Razer Klavye">Razer Klavye</option>
                    <option value="Logitech Mouse">Logitech Mouse</option>
                    <option value="Logitech Klavye">Logitech Klavye</option>
                    <option value="JBL Kulaklik">JBL Kulaklik</option>
                    <option value="Cizim Tableti">Cizim Tableti</option>
                </select>
            `;
            const form = document.getElementById("qrInputForm");
            if (!document.getElementById("qrCategory")) {
                form.insertAdjacentHTML("afterbegin", categoryDropdown);
            }

            qrInputModal.classList.remove("hidden");
        } else {
            setTimeout(handleQRScan, 500); // Retry scanning
        }
    }
}

function stopQRScanner() {
    if (qrStream) {
        qrStream.getTracks().forEach(track => track.stop());
        qrStream = null;
    }
    isScanning = false;
}

// Close QR Scanner Modal
qrCancelButton.addEventListener("click", () => {
    qrModal.classList.add("hidden");
    stopQRScanner();
});

// Close QR Input Modal
cancelQrInput.addEventListener("click", () => {
    qrInputModal.classList.add("hidden");
    resetQRInputModal(); // Reset the QR input modal when closed
});

// Cancel Add Assignment Modal
cancelButton.addEventListener("click", () => {
    modal.classList.add("hidden");
});

exportButton.addEventListener("click", () => {
    if (assignmentsData.length === 0) {
        alert("Excel çıktısı alabilmek için en az bir zimmet eklemelisiniz.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(assignmentsData); // JSON'dan Excel tablosu oluştur
    const workbook = XLSX.utils.book_new(); // Yeni bir Excel dosyası oluştur
    XLSX.utils.book_append_sheet(workbook, worksheet, "Zimmetler"); // Tabloyu ekle
    XLSX.writeFile(workbook, "Zimmetler.xlsx"); // Excel dosyasını indir
});