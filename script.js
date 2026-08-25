"use strict";
import CONFIG from "./src/config.js";

function renderCards(containerId, notes, className) {
  // 1. Найти контейнер по ID
  //console.log("step 1");
  const container = document.getElementById(containerId);

  // 2. Проверить, что контейнер существует
  if (!container) {
    console.error("Контейнер не найден:", containerId);
    return;
  }

  // 3. Если заметок нет — показать сообщение
  if (notes.length === 0) {
    container.innerHTML = '<p class="empty-message">Нет заметок</p>';
    return;
  }

  // 4. Создать HTML для каждой заметки
  const cardsHTML = notes
    .map((note) => {
      return `
            <div class="card ${className}">
                <p class="card-text">${note.text}</p>
            </div>
        `;
    })
    .join("");

  // 5. Вставить в контейнер
  container.innerHTML = cardsHTML;
}

async function loadNotes() {
  console.log("1. Начинаю загрузку...");

  // Ждем, пока fetch завершится
  const response = await fetch(CONFIG.SHEET_URL);
  /*console.log('2. Response получен:', response);
    console.log('3. Статус:', response.status);
    console.log('4. OK?', response.ok);
    
    // Если всё хорошо — читаем данные
    if (response.ok) {
        const csvText = await response.text();
        console.log('5. Данные получены, длина:', csvText.length);
        console.log('6. Первые 200 символов:', csvText.substring(0, 200));
    } else {
        console.error('Ошибка! Статус:', response.status);
    }*/
  console.log("2. Response получен:", response);
  console.log("4. OK?", response.ok);
  if (response.ok) {
    const csvText = await response.text();
    // 1. Разбиваем на строки
    // Вместо ручного разбора csvText:
    const result = Papa.parse(csvText, {
      header: true, // Первая строка - это заголовки
      skipEmptyLines: true, // Пропускать пустые строки
      trimHeaders: true, // Убрать пробелы у заголовков
    });

    const notes = result.data;
    console.log("Всего заметок (правильно):", notes.length);

    //console.log("Данные заметки:", notes[0]);
    // Обычные
    const ordinary = notes.filter(
      (note) => note.type.toLowerCase().trim() === "обычная",
    );
    console.log("Обычных:", ordinary.length);
    // for (let i = 0; i < ordinary.length; i++) {
    //   console.log(ordinary[i]);
    // }

    // Тренировки (пока пропускаем, но можем посчитать)
    const trainings = notes.filter(
      (note) => note.type.toLowerCase().trim() === "тренировка",
    );
    console.log("Тренировок:", trainings.length);
    // for (let i = 0; i < trainings.length; i++) {
    //   console.log(trainings[i]);
    // }

    // Важные
    const important = notes.filter(
      (note) => note.type.toLowerCase().trim() === "важная",
    );
    console.log("Важных:", important.length);
    /*for (let i = 0; i < important.length; i++) {
      console.log(important[i]);
    }*/

    // Отрисовываем
    renderCards("ordinaryContainer", ordinary, "card-usual");
    renderCards("trainingContainer", trainings, "card-training");
    renderCards("importantContainer", important, "card-important");
  } else {
    console.error("Ошибка! Статус:", response.status);
  }
}

// ЗАПУСКАЕМ
loadNotes();
// После того как получили csvText:
/*
console.log("Всего строк:", rows.length);

// 3. Остальные строки — данные
const dataRows = rows.slice(1);
console.log("Строк с данными:", dataRows.length);

// 4. Для каждой строки создаем объект
const notes = dataRows.map((row) => {
  // Внимание: текст может содержать запятые!
  // Для начала просто разделим по первой запятой
  const firstComma = row.indexOf(",");
  const type = row.substring(0, firstComma);
  const text = row.substring(firstComma + 1);

  return { type, text };
});

console.log("Всего заметок:", notes.length);
console.log("Первая заметка:", notes[0]);
*/
