// JS do calendário da página inicial

document.addEventListener('DOMContentLoaded', function() {
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  // Elementos do DOM
  const calendarDays = document.getElementById('calendar-days');
  const monthYearElement = document.getElementById('month-year');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const todayBtn = document.getElementById('today');

  // Nomes dos meses
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Renderiza o calendário
  function renderCalendar(month, year) {
    // Atualiza o cabeçalho
    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    // Limpa o calendário
    calendarDays.innerHTML = '';
    // Obtém o primeiro dia do mês e quantos dias tem o mês
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Obtém o dia da semana do primeiro dia (0-6, onde 0 é domingo)
    const startDay = firstDay.getDay();
    // Obtém o último dia do mês anterior
    const daysInLastMonth = new Date(year, month, 0).getDate();
    // Adiciona dias vazios para o mês anterior (se necessário)
    for (let i = 0; i < startDay; i++) {
      const day = daysInLastMonth - startDay + i + 1;
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day empty';
      dayElement.innerHTML = `<div class="day-number">${day}</div>`;
      calendarDays.appendChild(dayElement);
    }
    // Adiciona os dias do mês atual
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.getDate() === today.getDate() && 
                      date.getMonth() === today.getMonth() && 
                      date.getFullYear() === today.getFullYear();
      const dayElement = document.createElement('div');
      dayElement.className = `calendar-day ${isToday ? 'today' : ''}`;
      dayElement.innerHTML = `
        <div class="day-number">${i}</div>
        <div class="events-container">
          <!-- Eventos podem ser adicionados aqui -->
        </div>
      `;
      calendarDays.appendChild(dayElement);
    }
    // Calcula quantos dias faltam para completar a última semana
    const totalCells = startDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    // Adiciona dias vazios para o próximo mês (se necessário)
    for (let i = 1; i <= remainingCells; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day empty';
      dayElement.innerHTML = `<div class="day-number">${i}</div>`;
      calendarDays.appendChild(dayElement);
    }
  }
  // Navegação do calendário
  prevMonthBtn.addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });
  nextMonthBtn.addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });
  todayBtn.addEventListener('click', function() {
    currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    renderCalendar(currentMonth, currentYear);
  });
  // Inicializa o calendário
  renderCalendar(currentMonth, currentYear);
});
