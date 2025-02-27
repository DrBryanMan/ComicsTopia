import '/js/router.js';
import '/js/main.js';


async function renderPageData(comics_name) {

  if (pageData?.["Том 1"]?.[0]) {
      const issueData = pageData["Том 1"].find(issue => issue.id === "1") || pageData["Том 1"][0];
      
      mainContent.innerHTML = `
          <div class="issue-container">
            <div class="issue-header">
                <div class="issue-title">
                  <div class="series-title">${issueData.story_title || "Назва відсутня"}</div>
                  <h1>Том 1 #<span id="issueNumber">${issueData.id}</span></h1>
                </div>
                <div class="issue-actions">
                  <button id="editIssueButton">Редагувати</button>
                </div>
            </div>
            
            <div class="issue-content-layout">
              <div class="issue-cover-container">
                <img src="/api/placeholder/300/450" alt="Обкладинка коміксу" class="cover-image" id="coverImage">
              </div>
              
              <div class="issue-details">
                <div class="issue-info">
                  <h2>Інформація про випуск</h2>
                  
                  <div class="info-group">
                    <div class="info-item">
                      <div class="info-label">Дата виходу:</div>
                      <div class="info-value" id="releaseDate">${issueData.release || ""}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Дата публікації:</div>
                      <div class="info-value" id="publicationDate">${issueData.publication || ""}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Головний редактор:</div>
                      <div class="info-value" id="editorChief">${issueData.editor_chief || ""}</div>
                    </div>
                  </div>
                </div>
                
                <!-- Вкладки для історій -->
                <div class="stories-tabs">
                  ${generateStoriesTabs(issueData)}
                </div>
              </div>
            </div>
          </div>

          <!-- HTML для модального вікна редагування -->
          <div class="edit-modal" id="editModal">
            <div class="edit-modal-content">
              <div class="edit-modal-header">
                <h2>Редагування випуску</h2>
                <button class="close-edit-modal" id="closeEditModal">×</button>
              </div>
              
              <form class="edit-form" id="editForm">
                <div class="form-section">
                  <h3>Основна інформація</h3>
                  <div class="form-group">
                    <label for="editId">ID випуску</label>
                    <input type="text" id="editId" name="id" readonly>
                  </div>
                  <div class="form-group">
                    <label for="editCover">Обкладинка (шлях до файлу)</label>
                    <input type="text" id="editCover" name="cover">
                  </div>
                  <div class="form-group">
                    <label for="editRelease">Дата виходу</label>
                    <input type="text" id="editRelease" name="release">
                  </div>
                  <div class="form-group">
                    <label for="editPublication">Дата публікації</label>
                    <input type="text" id="editPublication" name="publication">
                  </div>
                  <div class="form-group">
                    <label for="editStoryTitle">Назва історії</label>
                    <input type="text" id="editStoryTitle" name="story_title">
                  </div>
                  <div class="form-group">
                    <label for="editEditorChief">Головний редактор</label>
                    <input type="text" id="editEditorChief" name="editor_chief">
                  </div>
                </div>
                
                <div class="form-section">
                  <h3>Творці</h3>
                  <div class="form-group">
                    <label for="editWriter">Автор</label>
                    <input type="text" id="editWriter" name="writer">
                  </div>
                  <div class="form-group">
                    <label for="editPenciler">Художник</label>
                    <input type="text" id="editPenciler" name="penciler">
                  </div>
                  <div class="form-group">
                    <label for="editInker">Інкер</label>
                    <input type="text" id="editInker" name="inker">
                  </div>
                  <div class="form-group">
                    <label for="editColorist">Колорист</label>
                    <input type="text" id="editColorist" name="colorist">
                  </div>
                  <div class="form-group">
                    <label for="editLetterer">Леттерер</label>
                    <input type="text" id="editLetterer" name="letterer">
                  </div>
                  <div class="form-group">
                    <label for="editEditor">Редактор</label>
                    <input type="text" id="editEditor" name="editor">
                  </div>
                </div>
                
                <div class="form-section">
                  <h3>Додаткові історії</h3>
                  <div id="storyFormsContainer">
                    <!-- Default first story form -->
                    <div class="story-form" data-index="0">
                      <h4>Історія 1</h4>
                      <div class="form-group">
                        <label for="editStoryTitle2">Назва історії</label>
                        <input type="text" id="editStoryTitle2" name="story_title2">
                      </div>
                      <div class="form-group">
                        <label for="editWriter2">Автор</label>
                        <input type="text" id="editWriter2" name="writer2">
                      </div>
                      <div class="form-group">
                        <label for="editPenciler2">Художник</label>
                        <input type="text" id="editPenciler2" name="penciler2">
                      </div>
                      <div class="form-group">
                        <label for="editInker2">Інкер</label>
                        <input type="text" id="editInker2" name="inker2">
                      </div>
                      <div class="form-group">
                        <label for="editColorist2">Колорист</label>
                        <input type="text" id="editColorist2" name="colorist2">
                      </div>
                      <div class="form-group">
                        <label for="editLetterer2">Леттерер</label>
                        <input type="text" id="editLetterer2" name="letterer2">
                      </div>
                      <div class="form-group">
                        <label for="editEditor2">Редактор</label>
                        <input type="text" id="editEditor2" name="editor2">
                      </div>
                    </div>
                  </div>
                  <button type="button" class="add-story-button" id="addStoryButton">+ Додати історію</button>
                </div>
                
                <div class="form-actions">
                  <button type="button" class="cancel-button" id="cancelEdit">Скасувати</button>
                  <button type="submit" class="save-button">Зберегти</button>
                </div>
              </form>
            </div>
          </div>
      `;

      function generateStoriesTabs(issueData) {
        // Збираємо всі ключі, що стосуються заголовків історій (story_title2, story_title3, ...)
        const storyTitles = [];
        
        // Додаємо основну історію
        storyTitles.push({
          id: 'story1',
          title: issueData.story_title || "Основна історія"
        });
        
        // Шукаємо додаткові історії в об'єкті storys
        if (issueData.storys) {
          for (let i = 2; i <= 10; i++) { // Обмеження для безпеки - максимум 10 історій
            const titleKey = `story_title${i}`;
            if (issueData.storys[titleKey]) {
              storyTitles.push({
                id: `story${i}`,
                title: issueData.storys[titleKey]
              });
            }
          }
        }
        
        // Генеруємо HTML для вкладок
        let tabsHeaderHTML = '';
        let tabsContentHTML = '';
        
        storyTitles.forEach((story, index) => {
          // Вкладки
          tabsHeaderHTML += `<button class="tab-button ${index === 0 ? 'active' : ''}" data-tab="${story.id}">${story.title}</button>`;
          
          // Контент для основної історії
          if (index === 0) {
            tabsContentHTML += `
              <div class="tab-content ${index === 0 ? 'active' : ''}" id="${story.id}">
                <h2>${story.title}</h2>
                
                <div class="info-group">
                  <div class="info-item">
                    <div class="info-label">Автор:</div>
                    <div class="info-value" id="writer">${issueData.writer || ""}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Художник:</div>
                    <div class="info-value" id="penciler">${issueData.penciler || ""}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Інкер:</div>
                    <div class="info-value" id="inker">${issueData.inker || ""}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Колорист:</div>
                    <div class="info-value" id="colorist">${issueData.colorist || ""}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Леттерер:</div>
                    <div class="info-value" id="letterer">${issueData.letterer || ""}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Редактор:</div>
                    <div class="info-value" id="editor">${issueData.editor || ""}</div>
                  </div>
                </div>
              </div>
            `;
          } else {
            // Для додаткових історій (індекс в storyTitles починається з 0, а нумерація історій з 2)
            const storyIndex = index + 1;
            
            tabsContentHTML += `
              <div class="tab-content" id="${story.id}">
                <h2>${story.title}</h2>
                
                <div class="info-group">
                  <div class="info-item">
                    <div class="info-label">Автор:</div>
                    <div class="info-value">${issueData.storys[`writer${storyIndex}`] || ""}</div>
                  </div>
                  ${issueData.storys[`penciler${storyIndex}`] ? 
                    `<div class="info-item">
                      <div class="info-label">Художник:</div>
                      <div class="info-value">${issueData.storys[`penciler${storyIndex}`]}</div>
                    </div>` : ""}
                  ${issueData.storys[`inker${storyIndex}`] ? 
                    `<div class="info-item">
                      <div class="info-label">Інкер:</div>
                      <div class="info-value">${issueData.storys[`inker${storyIndex}`]}</div>
                    </div>` : ""}
                  ${issueData.storys[`colorist${storyIndex}`] ? 
                    `<div class="info-item">
                      <div class="info-label">Колорист:</div>
                      <div class="info-value">${issueData.storys[`colorist${storyIndex}`]}</div>
                    </div>` : ""}
                  ${issueData.storys[`letterer${storyIndex}`] ? 
                    `<div class="info-item">
                      <div class="info-label">Леттерер:</div>
                      <div class="info-value">${issueData.storys[`letterer${storyIndex}`]}</div>
                    </div>` : ""}
                  ${issueData.storys[`editor${storyIndex}`] ? 
                    `<div class="info-item">
                      <div class="info-label">Редактор:</div>
                      <div class="info-value">${issueData.storys[`editor${storyIndex}`]}</div>
                    </div>` : ""}
                </div>
              </div>
            `;
          }
        });
        
        return `
          <div class="tabs-header">
            ${tabsHeaderHTML}
          </div>
          
          ${tabsContentHTML}
        `;
      }

      // Set up edit button click handler after rendering the page
      setupModalHandlers(issueData);
      
      // Set up tabs functionality
      setupTabs();
  } else {
      mainContent.innerHTML = `<span>Comics data is missing</span>`;
  }
}

// Функція для налаштування вкладок
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Деактивуємо всі вкладки
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Активуємо вибрану вкладку
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

function setupModalHandlers(issueData) {
  const editModal = document.getElementById('editModal');
  const editIssueButton = document.getElementById('editIssueButton');
  const closeEditModal = document.getElementById('closeEditModal');
  const cancelEdit = document.getElementById('cancelEdit');
  const editForm = document.getElementById('editForm');
  const addStoryButton = document.getElementById('addStoryButton');
  
  // Fill form with current data
  fillEditForm(issueData);
  
  // Open modal when edit button is clicked
  editIssueButton.addEventListener('click', () => {
    editModal.style.display = 'flex';
  });
  
  // Close modal when X button is clicked
  closeEditModal.addEventListener('click', () => {
    editModal.style.display = 'none';
  });
  
  // Close modal when Cancel button is clicked
  cancelEdit.addEventListener('click', () => {
    editModal.style.display = 'none';
  });
  
  // Add new story form
  addStoryButton.addEventListener('click', addNewStoryForm);
  
  // Handle form submission
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveFormData();
    editModal.style.display = 'none';
  });
}

function fillEditForm(issueData) {
  // Fill main issue data
  document.getElementById('editId').value = issueData.id || '';
  document.getElementById('editCover').value = issueData.cover || '';
  document.getElementById('editRelease').value = issueData.release || '';
  document.getElementById('editPublication').value = issueData.publication || '';
  document.getElementById('editStoryTitle').value = issueData.story_title || '';
  document.getElementById('editEditorChief').value = issueData.editor_chief || '';
  
  // Fill creators data
  document.getElementById('editWriter').value = issueData.writer || '';
  document.getElementById('editPenciler').value = issueData.penciler || '';
  document.getElementById('editInker').value = issueData.inker || '';
  document.getElementById('editColorist').value = issueData.colorist || '';
  document.getElementById('editLetterer').value = issueData.letterer || '';
  document.getElementById('editEditor').value = issueData.editor || '';
  
  // Fill story data if exists
  if (issueData.storys) {
    document.getElementById('editStoryTitle2').value = issueData.storys.story_title2 || '';
    document.getElementById('editWriter2').value = issueData.storys.writer2 || '';
    
    // Only set these if they exist in the story data
    if (document.getElementById('editPenciler2')) {
      document.getElementById('editPenciler2').value = issueData.storys.penciler2 || '';
    }
    if (document.getElementById('editInker2')) {
      document.getElementById('editInker2').value = issueData.storys.inker2 || '';
    }
    if (document.getElementById('editColorist2')) {
      document.getElementById('editColorist2').value = issueData.storys.colorist2 || '';
    }
    if (document.getElementById('editLetterer2')) {
      document.getElementById('editLetterer2').value = issueData.storys.letterer2 || '';
    }
    if (document.getElementById('editEditor2')) {
      document.getElementById('editEditor2').value = issueData.storys.editor2 || '';
    }
  }
}

function addNewStoryForm() {
  const storyFormsContainer = document.getElementById('storyFormsContainer');
  const storyForms = storyFormsContainer.querySelectorAll('.story-form');
  const newIndex = storyForms.length;
  
  // Індекс для імені полів (story_title2, story_title3, ...)
  const formIndex = newIndex + 2;
  
  const newStoryForm = document.createElement('div');
  newStoryForm.className = 'story-form';
  newStoryForm.dataset.index = newIndex;
  
  newStoryForm.innerHTML = `
    <h4>Історія ${newIndex + 1}</h4>
    <div class="form-group">
      <label for="editStoryTitle${formIndex}">Назва історії</label>
      <input type="text" id="editStoryTitle${formIndex}" name="story_title${formIndex}">
    </div>
    <div class="form-group">
      <label for="editWriter${formIndex}">Автор</label>
      <input type="text" id="editWriter${formIndex}" name="writer${formIndex}">
    </div>
    <div class="form-group">
      <label for="editPenciler${formIndex}">Художник</label>
      <input type="text" id="editPenciler${formIndex}" name="penciler${formIndex}">
    </div>
    <div class="form-group">
      <label for="editInker${formIndex}">Інкер</label>
      <input type="text" id="editInker${formIndex}" name="inker${formIndex}">
    </div>
    <div class="form-group">
      <label for="editColorist${formIndex}">Колорист</label>
      <input type="text" id="editColorist${formIndex}" name="colorist${formIndex}">
    </div>
    <div class="form-group">
      <label for="editLetterer${formIndex}">Леттерер</label>
      <input type="text" id="editLetterer${formIndex}" name="letterer${formIndex}">
    </div>
    <div class="form-group">
      <label for="editEditor${formIndex}">Редактор</label>
      <input type="text" id="editEditor${formIndex}" name="editor${formIndex}">
    </div>
    <button type="button" class="remove-story-button">- Видалити історію</button>
  `;
  
  storyFormsContainer.appendChild(newStoryForm);
  
  // Add event listener to the remove button
  const removeButton = newStoryForm.querySelector('.remove-story-button');
  removeButton.addEventListener('click', () => {
    newStoryForm.remove();
    updateStoryFormNumbers();
  });
}

function updateStoryFormNumbers() {
  const storyForms = document.querySelectorAll('.story-form');
  storyForms.forEach((form, index) => {
    form.querySelector('h4').textContent = `Історія ${index + 1}`;
    form.dataset.index = index;
  });
}

function saveFormData() {
  // Get the form data
  const formData = {
    id: document.getElementById('editId').value,
    cover: document.getElementById('editCover').value,
    release: document.getElementById('editRelease').value,
    publication: document.getElementById('editPublication').value,
    story_title: document.getElementById('editStoryTitle').value,
    editor_chief: document.getElementById('editEditorChief').value,
    writer: document.getElementById('editWriter').value,
    penciler: document.getElementById('editPenciler').value,
    inker: document.getElementById('editInker').value,
    colorist: document.getElementById('editColorist').value,
    letterer: document.getElementById('editLetterer').value,
    editor: document.getElementById('editEditor').value,
    storys: {}
  };
  
  // Збираємо дані з усіх форм історій
  const storyForms = document.querySelectorAll('.story-form');
  
  storyForms.forEach((form, index) => {
    // Отримуємо суфікс для ключів об'єкта (2, 3, 4, ...)
    const suffix = index + 2;
    
    // Збираємо всі поля історії
    const titleField = form.querySelector(`[name="story_title${suffix}"]`);
    const writerField = form.querySelector(`[name="writer${suffix}"]`);
    const pencilerField = form.querySelector(`[name="penciler${suffix}"]`);
    const inkerField = form.querySelector(`[name="inker${suffix}"]`);
    const coloristField = form.querySelector(`[name="colorist${suffix}"]`);
    const lettererField = form.querySelector(`[name="letterer${suffix}"]`);
    const editorField = form.querySelector(`[name="editor${suffix}"]`);
    
    // Додаємо поля, якщо вони існують і мають значення
    if (titleField && titleField.value) {
      formData.storys[`story_title${suffix}`] = titleField.value;
    }
    
    if (writerField && writerField.value) {
      formData.storys[`writer${suffix}`] = writerField.value;
    }
    
    if (pencilerField && pencilerField.value) {
      formData.storys[`penciler${suffix}`] = pencilerField.value;
    }
    
    if (inkerField && inkerField.value) {
      formData.storys[`inker${suffix}`] = inkerField.value;
    }
    
    if (coloristField && coloristField.value) {
      formData.storys[`colorist${suffix}`] = coloristField.value;
    }
    
    if (lettererField && lettererField.value) {
      formData.storys[`letterer${suffix}`] = lettererField.value;
    }
    
    if (editorField && editorField.value) {
      formData.storys[`editor${suffix}`] = editorField.value;
    }
  });
  
  // Send data to server to update JSON file
  fetch('/api/update-comic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comicName: currentComicName,
      issueId: formData.id,
      issueData: formData
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Дані успішно збережено!');
      // Reload the page data to show updated content
      renderPageData(currentComicName);
    } else {
      alert('Помилка при збереженні даних: ' + data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Помилка при збереженні даних.');
  });
}