document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Actualiza la fecha automáticamente con el día real
  actualizarFechaBanner();
});

// ==========================================================================
// GESTIÓN DEL MENÚ LATERAL (DRAWER)
// ==========================================================================
function toggleDrawer() {
  const drawer = document.getElementById('side-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  
  if (drawer && backdrop) {
    drawer.classList.toggle('active');
    backdrop.classList.toggle('active');
  }
}

function openDrawerOption(optionName) {
  toggleDrawer();
  alert(`Sección "${optionName}" en desarrollo.`);
}

// ==========================================================================
// GESTIÓN DE HISTORIAL DE PEDIDOS (LOCALSTORAGE)
// ==========================================================================
function openHistoryModal() {
  toggleDrawer();
  renderHistoryList();
  document.getElementById('history-modal').style.display = 'flex';
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeHistoryModal() {
  document.getElementById('history-modal').style.display = 'none';
}

function getStoredOrders() {
  const data = localStorage.getItem('cantina_itr_pedidos');
  return data ? JSON.parse(data) : [];
}

function saveOrderToHistory(order) {
  const orders = getStoredOrders();
  orders.unshift(order); // agrega al principio
  localStorage.setItem('cantina_itr_pedidos', JSON.stringify(orders));
}

function renderHistoryList() {
  const container = document.getElementById('history-list-container');
  const clearBtn = document.getElementById('history-clear-btn');
  const orders = getStoredOrders();

  if (!container) return;

  if (orders.length === 0) {
    clearBtn.style.display = 'none';
    container.innerHTML = `
      <div class="history-empty-state">
        <i data-lucide="calendar-x" class="history-empty-icon"></i>
        <span class="history-empty-title">No hay pedidos registrados todavía</span>
        <span class="history-empty-desc">Tus pedidos confirmados aparecerán acá con su fecha y detalle.</span>
      </div>
    `;
  } else {
    clearBtn.style.display = 'flex';
    container.innerHTML = orders.map((o) => `
      <div class="history-card">
        <div class="history-card-top">
          <span class="history-date">${o.fecha}</span>
          <span class="history-price">$10.000</span>
        </div>
        <div class="history-item-title">${o.menu}</div>
        <div class="history-meta-row">
          <span>${o.alumno} · ${o.curso}</span>
          <span class="history-badge-status">
            <i data-lucide="check" style="width: 13px; height: 13px; stroke-width: 3;"></i>
            ${o.modalidad}
          </span>
        </div>
      </div>
    `).join('');
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function clearHistory() {
  if (confirm("¿Estás seguro de que deseas borrar todo el historial de pedidos?")) {
    localStorage.removeItem('cantina_itr_pedidos');
    renderHistoryList();
  }
}

// ==========================================================================
// GESTIÓN DEL BUZÓN DE QUEJAS Y SUGERENCIAS
// ==========================================================================
let currentFeedbackType = 'queja';

function openFeedbackModal() {
  toggleDrawer();
  setFeedbackType('queja');
  document.getElementById('feedback_message').value = '';
  document.getElementById('feedback_student').value = '';
  document.getElementById('feedback-modal').style.display = 'flex';
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeFeedbackModal() {
  document.getElementById('feedback-modal').style.display = 'none';
}

function setFeedbackType(type) {
  currentFeedbackType = type;
  const btnQueja = document.getElementById('type-btn-queja');
  const btnSugerencia = document.getElementById('type-btn-sugerencia');
  const label = document.getElementById('feedback-message-label');
  const submitBtn = document.getElementById('feedback-submit-btn');

  if (type === 'queja') {
    btnQueja.classList.add('active');
    btnSugerencia.classList.remove('active');
    label.innerHTML = 'Detalle de tu Queja <span class="required">*</span>';
    submitBtn.innerText = 'Enviar queja';
  } else {
    btnSugerencia.classList.add('active');
    btnQueja.classList.remove('active');
    label.innerHTML = 'Detalle de tu Sugerencia <span class="required">*</span>';
    submitBtn.innerText = 'Enviar sugerencia';
  }
}

function submitFeedback() {
  const messageInput = document.getElementById('feedback_message');
  const studentInput = document.getElementById('feedback_student');
  
  const message = messageInput.value.trim();
  const student = studentInput.value.trim();

  if (!message) {
    messageInput.focus();
    return;
  }

  const typeName = currentFeedbackType === 'queja' ? 'queja' : 'sugerencia';

  alert(
    `✅ ¡Muchas gracias!\n\n` +
    `Tu ${typeName} ha sido enviada correctamente al equipo de la Cantina del Instituto Técnico Renault.\n` +
    (student ? `Identificación: ${student}\n` : '') +
    `La revisaremos para seguir mejorando nuestro servicio.`
  );

  closeFeedbackModal();
}

// ==========================================================================
// FECHA DINÁMICA
// ==========================================================================
function actualizarFechaBanner() {
  const hoy = new Date();

  const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ];

  const diaNombre = diasSemana[hoy.getDay()];
  const diaNumero = hoy.getDate();
  const mesNumero = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();

  const tituloFechaEl = document.getElementById('current-date-title');
  if (tituloFechaEl) {
    tituloFechaEl.innerText = `Menu del Dia: ${diaNombre} ${diaNumero}/${mesNumero}/${anio}`;
  }
}

// ==========================================================================
// GESTIÓN DE MÉTODO DE PAGO
// ==========================================================================
let currentMethod = 'transfer';

function selectPayment(method) {
  currentMethod = method;

  const optTransfer = document.getElementById('option-transfer');
  const optCash = document.getElementById('option-cash');
  const radioTransfer = document.getElementById('radio-transfer');
  const radioCash = document.getElementById('radio-cash');
  const aliasBox = document.getElementById('alias-box');
  const summaryPayment = document.getElementById('summary-payment');

  if (method === 'transfer') {
    optTransfer.className = "payment-card selected";
    optCash.className = "payment-card unselected";

    radioTransfer.className = "custom-radio selected";
    radioTransfer.innerHTML = '<i data-lucide="check" class="radio-check"></i>';

    radioCash.className = "custom-radio unselected";
    radioCash.innerHTML = '';

    aliasBox.style.display = 'block';
    summaryPayment.innerText = 'Transferencia Inmediata';
  } else {
    optCash.className = "payment-card selected";
    optTransfer.className = "payment-card unselected";

    radioCash.className = "custom-radio selected";
    radioCash.innerHTML = '<i data-lucide="check" class="radio-check"></i>';

    radioTransfer.className = "custom-radio unselected";
    radioTransfer.innerHTML = '';

    aliasBox.style.display = 'none';
    summaryPayment.innerText = 'Pago en el comedor';
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function copyAlias(event) {
  if (event) event.stopPropagation();

  const alias = "CANTINAITR.MP";
  navigator.clipboard.writeText(alias).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.innerHTML = '<i data-lucide="check" class="btn-icon"></i><span>¡Copiado!</span>';
    btn.style.backgroundColor = '#059669';

    if (window.lucide) {
      window.lucide.createIcons();
    }

    setTimeout(() => {
      btn.innerHTML = '<i data-lucide="copy" class="btn-icon"></i><span>Copiar</span>';
      btn.style.backgroundColor = '#0e1526';
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }, 2000);
  });
}

// ==========================================================================
// CONFIRMACIÓN DE PEDIDO Y GUARDADO EN HISTORIAL
// ==========================================================================
function confirmOrder() {
  const nameInput = document.getElementById('student_name');
  const courseInput = document.getElementById('student_course');
  const dietInput = document.getElementById('student_diet');

  const name = nameInput.value.trim();
  const course = courseInput.value.trim();
  const diet = dietInput.value.trim();

  if (!name || !course) {
    if (!name) nameInput.focus();
    else courseInput.focus();
    return;
  }

  const paymentDesc = currentMethod === 'transfer' 
    ? 'Transferencia Inmediata' 
    : 'Pago en el comedor';

  // Guardar en el historial local
  const hoy = new Date();
  const fechaStr = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()} · ${hoy.getHours().toString().padStart(2, '0')}:${hoy.getMinutes().toString().padStart(2, '0')}hs`;

  saveOrderToHistory({
    fecha: fechaStr,
    alumno: name,
    curso: course,
    dieta: diet || 'Ninguna',
    modalidad: paymentDesc,
    menu: 'Menú Completo: Milanesa con puré'
  });

  // Mostrar datos en el modal de confirmación
  document.getElementById('m-name').innerText = name;
  document.getElementById('m-course').innerText = course;
  document.getElementById('m-diet').innerText = diet ? diet : 'Ninguna';
  document.getElementById('m-payment').innerText = currentMethod === 'transfer' 
    ? 'Transferencia Inmediata' 
    : 'Pago en el comedor (Efectivo/QR)';

  document.getElementById('custom-modal').style.display = 'flex';

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeCustomModal() {
  document.getElementById('custom-modal').style.display = 'none';
}

// ==========================================================================
// TEMPORIZADOR
// ==========================================================================
let minutes = 19;
let seconds = 59;

setInterval(() => {
  if (seconds > 0) {
    seconds--;
  } else if (minutes > 0) {
    minutes--;
    seconds = 59;
  }
  const formattedSecs = seconds < 10 ? '0' + seconds : seconds;
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    countdownEl.innerText = `Cierra en ${minutes}:${formattedSecs} Min`;
  }
}, 1000);
