// import { fetchCreatorsData } from './fetchCreatorsData.js'
// import { fetchCharactersData } from './fetchCharactersData.js'
// const fdpath = 'https://images.wikia.nocookie.net/marveldatabase/images/thumb/'
const cvimgpath = 'https://comicvine.gamespot.com/a/uploads/scale_small/'

export async function issuePage(data, publisher, series, vol, issue) {
  const [creatorsData, charsData] = [await getCreatorsData(data), await getCharactersData(data)]
  async function getCreatorsData(data) {
    const creatorFields = ['image_artist', 'image_artist2', 'editor_chief', 'writer', 'penciler', 'inker', 'colorist', 'letterer', 'editor', 'writer2'];

    // Завантажуємо список авторів
    const creators = await fetch('../json/creators.json').then(res => res.json());

    // Збираємо унікальні айді авторів
    const creatorIds = new Set();

    // Отримуємо ID авторів з основних полів
    creatorFields.forEach(field => data[field] && creatorIds.add(parseInt(data[field].split('-')[0], 10)));

    // Отримуємо ID авторів зі stories
    data.storys?.forEach(story => {
      creatorFields.forEach(field => story[field] && creatorIds.add(parseInt(story[field].split('-')[0], 10)));
    });

    // Фільтруємо потрібних авторів
    return creators
      .filter(creator => creatorIds.has(creator.id))
      .reduce((acc, creator) => {
        acc[creator.id] = { name: creator.ua_name || creator.name, image: creator.image || null };
        return acc;
      }, {});
  }

  async function getCharactersData(data) { 
    const characters = data.characters;
    const charactersJson = await fetch('../json/characters.json').then(res => res.json());

    const characterIds = characters.map(character => parseInt(character.split(/-(.+)/)[0], 10));
    return charactersJson.filter(char => characterIds.includes(char.id));
  }
  console.log(creatorsData)
  console.log(charsData)

  function getCreatorData(creatorName, key) {
    const numericId = parseInt(creatorName.split('-')[0], 10)
    return creatorsData[numericId][key] || null
  }

  mainContent.innerHTML = `
      <div class="issue-container">
        <!-- Ліва частина -->
        <div class="left-column">
            <!-- Постер -->
          <div id="issueCover" class="issue-poster-container">
            <img src="${data.cover}" class="issue-poster">
          </div>

          <!-- Основна інформація -->
          <div class="issue-info info-group">
            <div class="info-item">
              <div class="info-label">Дата релізу:</div>
              <div class="info-value">${data.release || ""}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Дата публікації:</div>
              <div class="info-value">${data.publication || ""}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Видавництво:</div>
              <div class="info-value">${data.publisher || "Marvel"}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Гл. редактор:</div>
              <div class="info-value">${getCreatorData(data.editor_chief, 'name') || ""}</div>
            </div>
          </div>
        </div>
          
        <!-- Права частина -->
        <div class="right-column">
          <!-- Заголовок -->
          <div class="issue-header">
              <div class="issue-title">
                <h1>${data.title || "Дивовижна Людина-павук"} <span>#${data.id}</span></h1>
                <span><i>${data.title || "Amazing Spider-Man #1"}</i></span>
              </div>
              <div class="issue-actions">
                <button id="issueEditButton">Редагувати</button>
              </div>
          </div>
          
          <!-- Творці / Історії -->
          <div id="Storys" class="stories-tabs">
            <h2>Творці</h2>
            ${generateStoriesTabs()}
          </div>
          
          <!-- Персонажі -->
          <div id="Characters" class="characters-section">
            <h2>Персонажі</h2>
            <div class="characters-container info-group">
              ${renderCharactersSection()}
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
  `

  function generateStoriesTabs() {
    // Збираємо всі ключі, що стосуються заголовків історій
    const storyTitles = []
    
    // Додаємо основну історію
    storyTitles.push({
      id: 1,
      title: data.story_title || "Основна історія"
    })
    
    // Шукаємо додаткові історії в масиві storys
    if (data.storys) {
      data.storys.forEach((story, index) => {
        if (story.story_title) {
          storyTitles.push({
            id: index + 2,
            title: story.story_title
          })
        }
      })
    }

    function creatorCard(image, creatorName, role) {
      return `
        <div class="info-item">
          <div class="person-portret">
            <img src="${image ? cvimgpath + image : ''}">
          </div>
          <div class="info-value" id="${role.toLowerCase().replace(/\s+/g, '')}">${creatorName || ""}
            <div class="info-label">${role}</div>
          </div>
        </div>
      `
    }
      
    // Генеруємо HTML для вкладок
    let tabsHeaderHTML = ''
    let tabsContentHTML = ''
    
    storyTitles.forEach((story, index) => {
      // Вкладки
      tabsHeaderHTML += `<button class="tab-button ${index === 0 ? 'active' : ''}" data-tab="${story.id}">${story.id}</button>`
      
      // Контент для основної історії
      if (index === 0) {
        tabsContentHTML += `
          <div class="tab-content ${index === 0 ? 'active' : ''}" id="${story.id}">
            <h3>${story.title}</h2>
            <div class="storys-info info-group">
              ${creatorCard(getCreatorData(data.editor_chief, 'image'), getCreatorData(data.editor_chief, 'name'), 'Сценарій')}
              ${creatorCard(getCreatorData(data.writer, 'image'), getCreatorData(data.writer, 'name'), 'Сценарій')}
              ${data.writer2 ? creatorCard(getCreatorData(data.writer2, 'image'), getCreatorData(data.writer2, 'name'), 'Сценарій') : ''}
              ${creatorCard(getCreatorData(data.penciler, 'image'), getCreatorData(data.penciler, 'name'), 'Малюнок')}
              ${creatorCard(getCreatorData(data.inker, 'image'), getCreatorData(data.inker, 'name'), 'Туш')}
              ${creatorCard(getCreatorData(data.colorist, 'image'), getCreatorData(data.colorist, 'name'), 'Колір')}
              ${creatorCard(getCreatorData(data.letterer, 'image'), getCreatorData(data.letterer, 'name'), 'Шрифт')}
              ${creatorCard(getCreatorData(data.editor, 'image'), getCreatorData(data.editor, 'name'), 'Редактор')}
            </div>
          </div>
        `
      } else {
        // Для додаткових історій
        const storyData = data.storys[index - 1]
        tabsContentHTML += `
          <div class="tab-content" id="${story.id}">
            <h2>${story.title}</h2>
            <div class="storys-info info-group">
              ${creatorCard(data.cover, storyData.writer, 'Сценарій')}
              ${storyData.writer2 ? creatorCard(data.cover, storyData.writer2, 'Сценарій') : ''}
              ${creatorCard(data.cover, storyData.penciler, 'Малюнок')}
              ${creatorCard(data.cover, storyData.inker, 'Туш')}
              ${creatorCard(data.cover, storyData.colorist, 'Колір')}
              ${creatorCard(data.cover, storyData.letterer, 'Шрифт')}
              ${creatorCard(data.cover, storyData.editor, 'Редактор')}
            </div>
          </div>
        `
      }
    })
    
    return `
      <div class="tabs-header">
        ${tabsHeaderHTML}
      </div>
      
      ${tabsContentHTML}
    `
  }
  setupModalHandlers(data)
  setupTabs()


  function renderCharactersSection() {
    const roleAbbr = {
      "main": "Головний",
      "sec": "Другорядний",
      "hero": "Герой",
      "vil": "Лиходій",
      "cameo": "Камео",
      "first": "Перша поява",
      "fb": "Флешбек",
      "dead": "Загинув",
    }

    // function getCharData(charName, key) {
    //   const id = parseInt(charName.split('-')[0], 10)
    //   return charsData[id][key] || null
    // }

    function characterCard(image, fname, earth, sname, alias, role, status) {
      return `
        <div class="info-item ${role} ${status}">
          <div class="character-portret">
            <img src="${image ? cvimgpath + image : ''}">
          </div>
          <div class="info-value">
            <div class="char-name">${alias ? "<b>" + alias + "</b>" + "<br>" + sname : "<b>" + sname + "</b>" || "Невідомо"}</div>
            <div class="char-role">${roleAbbr[role] || role}</div>
            ${status ? '<div class="char-status">' + roleAbbr[status] + '</div>':''}
          </div>
        </div>
      `
    }

    let div = ''
    data.characters.forEach(character => {
      // 1-Peter Parker:616|Peter Parker/Spider-Man|sup
      const [id, name1, name2, rolestat] = [character.split('-')[0], ...character.split('-').slice(1).join('-').split('|')]
      const [fname, earth] = name1.split(':')
      const [sname, alias] = name2.split('/')
      const [role, status] = rolestat.split('/')
      const charData = charsData.find(char => char.id === parseInt(id))
      console.log("charData:",  id, fname, earth, sname, alias, roleAbbr[role])
      
      div += `${characterCard(charData.image, fname, earth, sname, alias, role, status)}`
    })
    return div
  }
}

// Функція для налаштування вкладок
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button')
  const tabContents = document.querySelectorAll('.tab-content')
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Деактивуємо всі вкладки
      tabButtons.forEach(btn => btn.classList.remove('active'))
      tabContents.forEach(content => content.classList.remove('active'))
      
      // Активуємо вибрану вкладку
      button.classList.add('active')
      const tabId = button.getAttribute('data-tab')
      document.getElementById(tabId).classList.add('active')
    })
  })
}

function setupModalHandlers(data) {
  // const editModal = document.getElementById('editModal')
  // const editIssueButton = document.getElementById('editIssueButton')
  // const closeEditModal = document.getElementById('closeEditModal')
  // const cancelEdit = document.getElementById('cancelEdit')
  // const editForm = document.getElementById('editForm')
  // const addStoryButton = document.getElementById('addStoryButton')
  
  fillEditForm(data)
  issueEditButton.onclick = () => editModal.style.display = 'flex'
  closeEditModal.onclick = () => editModal.style.display = 'none'
  cancelEdit.onclick = () =>  editModal.style.display = 'none'
  addStoryButton.onclick = addNewStoryForm
  
  editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    saveFormData()
    editModal.style.display = 'none'
  })
}

function fillEditForm(data) {
  // Fill main issue data
  document.getElementById('editId').value = data.id || ''
  document.getElementById('editCover').value = data.cover || ''
  document.getElementById('editRelease').value = data.release || ''
  document.getElementById('editPublication').value = data.publication || ''
  document.getElementById('editStoryTitle').value = data.story_title || ''
  document.getElementById('editEditorChief').value = data.editor_chief || ''
  
  // Fill creators data
  document.getElementById('editWriter').value = data.writer || ''
  document.getElementById('editPenciler').value = data.penciler || ''
  document.getElementById('editInker').value = data.inker || ''
  document.getElementById('editColorist').value = data.colorist || ''
  document.getElementById('editLetterer').value = data.letterer || ''
  document.getElementById('editEditor').value = data.editor || ''
  
  // Fill story data if exists
  if (data.storys && data.storys.length > 0) {
    const firstStory = data.storys[0]
    
    document.getElementById('editStoryTitle2').value = firstStory.story_title || ''
    document.getElementById('editWriter2').value = firstStory.writer || ''
    
    if (document.getElementById('editPenciler2')) {
      document.getElementById('editPenciler2').value = firstStory.penciler || ''
    }
    if (document.getElementById('editInker2')) {
      document.getElementById('editInker2').value = firstStory.inker || ''
    }
    if (document.getElementById('editColorist2')) {
      document.getElementById('editColorist2').value = firstStory.colorist || ''
    }
    if (document.getElementById('editLetterer2')) {
      document.getElementById('editLetterer2').value = firstStory.letterer || ''
    }
    if (document.getElementById('editEditor2')) {
      document.getElementById('editEditor2').value = firstStory.editor || ''
    }
    
    // Додаткові історії (якщо є)
    const additionalStoryForms = document.querySelectorAll('.story-form:not([data-index="0"])')
    
    data.storys.slice(1).forEach((story, index) => {
      if (additionalStoryForms[index]) {
        const formIndex = index + 2
        
        const titleField = additionalStoryForms[index].querySelector(`[name="story_title${formIndex}"]`)
        const writerField = additionalStoryForms[index].querySelector(`[name="writer${formIndex}"]`)
        const pencilerField = additionalStoryForms[index].querySelector(`[name="penciler${formIndex}"]`)
        const inkerField = additionalStoryForms[index].querySelector(`[name="inker${formIndex}"]`)
        const coloristField = additionalStoryForms[index].querySelector(`[name="colorist${formIndex}"]`)
        const lettererField = additionalStoryForms[index].querySelector(`[name="letterer${formIndex}"]`)
        const editorField = additionalStoryForms[index].querySelector(`[name="editor${formIndex}"]`)
        
        if (titleField) titleField.value = story.story_title || ''
        if (writerField) writerField.value = story.writer || ''
        if (pencilerField) pencilerField.value = story.penciler || ''
        if (inkerField) inkerField.value = story.inker || ''
        if (coloristField) coloristField.value = story.colorist || ''
        if (lettererField) lettererField.value = story.letterer || ''
        if (editorField) editorField.value = story.editor || ''
      }
    })
  }
}

function addNewStoryForm() {
  const storyFormsContainer = document.getElementById('storyFormsContainer')
  const storyForms = storyFormsContainer.querySelectorAll('.story-form')
  const newIndex = storyForms.length
  
  // Індекс для імені полів (story_title2, story_title3, ...)
  const formIndex = newIndex + 2
  
  const newStoryForm = document.createElement('div')
  newStoryForm.className = 'story-form'
  newStoryForm.dataset.index = newIndex
  
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
  `
  
  storyFormsContainer.appendChild(newStoryForm)
  
  // Add event listener to the remove button
  const removeButton = newStoryForm.querySelector('.remove-story-button')
  removeButton.addEventListener('click', () => {
    newStoryForm.remove()
    updateStoryFormNumbers()
  })
}

function updateStoryFormNumbers() {
  const storyForms = document.querySelectorAll('.story-form')
  storyForms.forEach((form, index) => {
    form.querySelector('h4').textContent = `Історія ${index + 1}`
    form.dataset.index = index
  })
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
    storys: []
  }
  
  // Збираємо дані з усіх форм історій
  const storyForms = document.querySelectorAll('.story-form')
  
  storyForms.forEach((form, index) => {
    // Отримуємо суфікс для ключів об'єкта (2, 3, 4, ...)
    const suffix = index + 2
    
    // Збираємо всі поля історії
    const titleField = form.querySelector(`[name="story_title${suffix}"]`)
    const writerField = form.querySelector(`[name="writer${suffix}"]`)
    const pencilerField = form.querySelector(`[name="penciler${suffix}"]`)
    const inkerField = form.querySelector(`[name="inker${suffix}"]`)
    const coloristField = form.querySelector(`[name="colorist${suffix}"]`)
    const lettererField = form.querySelector(`[name="letterer${suffix}"]`)
    const editorField = form.querySelector(`[name="editor${suffix}"]`)
    
    const storyData = {}
    
    // Додаємо поля, якщо вони існують і мають значення
    if (titleField && titleField.value) {
      storyData.story_title = titleField.value
    }
    
    if (writerField && writerField.value) {
      storyData.writer = writerField.value
    }
    
    if (pencilerField && pencilerField.value) {
      storyData.penciler = pencilerField.value
    }
    
    if (inkerField && inkerField.value) {
      storyData.inker = inkerField.value
    }
    
    if (coloristField && coloristField.value) {
      storyData.colorist = coloristField.value
    }
    
    if (lettererField && lettererField.value) {
      storyData.letterer = lettererField.value
    }
    
    if (editorField && editorField.value) {
      storyData.editor = editorField.value
    }
    
    // Додаємо історію до масиву, якщо є хоча б одне поле
    if (Object.keys(storyData).length > 0) {
      formData.storys.push(storyData)
    }
  })
  
  // Send data to server to update JSON file
  fetch('/api/update-comic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comicName: currentComicName,
      issueId: formData.id,
      data: formData
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Дані успішно збережено!')
      // Reload the page data to show updated content
      renderPageData(currentComicName)
    } else {
      alert('Помилка при збереженні даних: ' + data.error)
    }
  })
  .catch(error => {
    console.error('Error:', error)
    alert('Помилка при збереженні даних.')
  })
}