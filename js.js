import Navigo from "https://cdn.jsdelivr.net/npm/navigo@8/+esm"

// Ініціалізація роутера
const router = new Navigo('/', { hash: true });

// DOM елементи
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');
const contentContainer = document.getElementById('content-container');
const navItems = document.querySelectorAll('.nav-item');

// Переключення стану бічної панелі
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('expanded');
  
  // Зберігаємо стан у локальному сховищі
  localStorage.setItem('sidebarExpanded', sidebar.classList.contains('expanded'));
});

// Відновлюємо стан бічної панелі при завантаженні
document.addEventListener('DOMContentLoaded', () => {
  const expanded = localStorage.getItem('sidebarExpanded') === 'true';
  if (expanded) {
    sidebar.classList.add('expanded');
  }
  
  // Виділяємо активну сторінку на основі поточного URL
  updateActiveNavItem();
});

// Функція для виділення активного пункту навігації
function updateActiveNavItem() {
  const currentHash = window.location.hash || '#/';
  
  navItems.forEach(item => {
    item.classList.remove('active');
    
    const itemHash = item.getAttribute('href');
    if (currentHash.startsWith(itemHash)) {
      item.classList.add('active');
    }
  });
}

// Функція для рендеру сторінки персонажа
function renderPage(type, id) {
  let content = '';
  
  if (type === 'characters') {
    content = `
      <div class="page-header">
        <h1>${id}</h1>
      </div>
      <div class="character-profile">
        <div class="character-main-info">
          <div class="character-avatar-large">
            <img src="/api/placeholder/300/300" alt="${id}">
          </div>
          <div class="character-biography">
            <h2>Біографія</h2>
            <p>Детальна інформація про персонажа ${id} буде додана пізніше.</p>
          </div>
        </div>
        
        <div class="character-appearances">
          <h2>Появи в коміксах</h2>
          <div class="comics-list">
            <p>Коміски з цим персонажем будуть додані пізніше.</p>
          </div>
        </div>
      </div>
    `;
  } else {
    content = `<h1>Сторінка не знайдена</h1>`;
  }
  
  contentContainer.innerHTML = content;
  updateActiveNavItem();
}

// Функція для рендеру даних щодо випуску або серії коміксів
function renderPageData(type, fullName, comicsName, vol, issue = null) {
  let content = '';
  
  if (type === 'comics') {
    content = `
      <div class="page-header">
        <h1>${comicsName}</h1>
        <div class="page-subtitle">Том ${vol}</div>
      </div>
      <div class="comics-profile">
        <div class="comics-info">
          <div class="comics-cover-large">
            <img src="/api/placeholder/250/380" alt="${comicsName}">
          </div>
          <div class="comics-details">
            <h2>Інформація про серію</h2>
            <ul class="info-list">
              <li><strong>Назва:</strong> ${comicsName}</li>
              <li><strong>Том:</strong> ${vol}</li>
              <li><strong>Видавець:</strong> Marvel Comics</li>
            </ul>
          </div>
        </div>
        
        <div class="issues-list">
          <h2>Випуски</h2>
          <div class="issues-grid">
            ${getIssuesContent(comicsName, vol)}
          </div>
        </div>
      </div>
    `;
  } else if (type === 'issue') {
    // Отримання даних про випуск з JSON
    const issueData = getIssueData(vol, issue);
    
    content = `
      <div class="page-header">
        <h1>${comicsName} #${issue}</h1>
        <div class="page-subtitle">Том ${vol}</div>
      </div>
      <div class="issue-profile">
        <div class="issue-info">
          <div class="issue-cover-large">
            <img src="/api/placeholder/250/380" alt="${comicsName} #${issue}">
          </div>
          <div class="issue-details">
            <h2>Інформація про випуск</h2>
            <ul class="info-list">
              <li><strong>Назва:</strong> ${issueData?.story_title || 'Невідомо'}</li>
              <li><strong>Дата виходу:</strong> ${issueData?.release || 'Невідомо'}</li>
              <li><strong>Сценарист:</strong> ${issueData?.writer || 'Невідомо'}</li>
              <li><strong>Художник:</strong> ${issueData?.penciler || 'Невідомо'}</li>
              <li><strong>Інкер:</strong> ${issueData?.inker || 'Невідомо'}</li>
              <li><strong>Колорист:</strong> ${issueData?.colorist || 'Невідомо'}</li>
              <li><strong>Леттерер:</strong> ${issueData?.letterer || 'Невідомо'}</li>
              <li><strong>Редактор:</strong> ${issueData?.editor || 'Невідомо'}</li>
            </ul>
          </div>
        </div>
        
        ${issueData && issueData.storys ? `
        <div class="additional-stories">
          <h2>Додаткові історії</h2>
          <div class="story-info">
            <h3>${issueData.storys.story_title2 || 'Невідома історія'}</h3>
            <ul class="info-list">
              <li><strong>Сценарист:</strong> ${issueData.storys.writer2 || 'Невідомо'}</li>
              ${issueData.storys.penciler2 ? `<li><strong>Художник:</strong> ${issueData.storys.penciler2}</li>` : ''}
              ${issueData.storys.inker2 ? `<li><strong>Інкер:</strong> ${issueData.storys.inker2}</li>` : ''}
              ${issueData.storys.colorist2 ? `<li><strong>Колорист:</strong> ${issueData.storys.colorist2}</li>` : ''}
              ${issueData.storys.letterer2 ? `<li><strong>Леттерер:</strong> ${issueData.storys.letterer2}</li>` : ''}
              ${issueData.storys.editor2 ? `<li><strong>Редактор:</strong> ${issueData.storys.editor2}</li>` : ''}
            </ul>
          </div>
        </div>
        ` : ''}
        
        <div class="issue-characters">
          <h2>Персонажі</h2>
          <p>Інформація про персонажів цього випуску буде додана пізніше.</p>
        </div>
      </div>
    `;
  } else {
    content = `<h1>Сторінка не знайдена</h1>`;
  }
  
  contentContainer.innerHTML = content;
  updateActiveNavItem();
}

// Функція для отримання даних про випуск
function getIssueData(vol, issue) {
  // Це приклад, дані мають завантажуватись з вашого JSON файлу
  // В реальному додатку тут буде запит до API або локальної бази даних
  const sampleData = {
    "1": [
      { "id": "-1", "cover": "", "release": "05-14-1997", "publication": "1-7-1997", "image1_artist1": "Joe Bennett", "image1_artist2": "Joe Pimentel", "editor_chief": "Bob Harras", "story_title": "Куди зникли всі герої?; Where Have All the Heroes Gone", "writer": "Tom DeFalco", "penciler": "Joe Bennett", "inker": "Bud LaRosa", "colorist": "Bob Sharen", "letterer": "Richard Starkings", "editor": "Ralph Macchio", "event": "Flashback (Event)", 
      "storys": {
        "story_title2": "The Secrets of Peter Parker!", "writer2": "Tom DeFalco"
        }
      },
      { "id": "1", "cover": "d/d5/Amazing_Spider-Man_Vol_1_1.jpg", "release": "12-10-1962", "publication": "1-3-1963", "story_title": "Людина-павук", "image1_artist": "Jack Kirby, Steve Ditko, Stan Goldberg and Artie Simek", "editor_chief": "Stan Lee", "writer": "Stan Lee, Steve Ditko", "penciler": "Steve Ditko", "inker": "Steve Ditko", "colorist": "Stan Goldberg", "letterer": "Jon D'Agostino", "editor": "Stan Lee",
      "storys": {
        "story_title2": "Людина-павук проти Хамелеона!", "writer2": "Stan Lee\nSteve Ditko", "penciler2": "Steve Ditko", "inker2": "Steve Ditko", "colorist2": "Stan Goldberg", "letterer2": "John Duffy", "editor2": "Stan Lee"
        }
      },
      { "id": "2", "release": "02-12-1963", "publication": "1-5-1963", "image1_artist1": "Steve Ditko", "editor_chief": "Stan Lee", "story_title": "Duel to the Death with the Vulture!", "writer": "Stan Lee", "writer_2": "Steve Ditko", "penciler": "Steve Ditko", "inker": "Steve Ditko", "colorist": "", "letterer": "John Duffy", "editor": "Stan Lee", "story_title2": "The Uncanny Threat of the Terrible Tinkerer!", "writer2": "Stan Lee"}
    ]
  };

  // Знаходимо випуск за номером
  const issues = sampleData["1"];
  return issues.find(item => item.id === issue);
}

// Функція для генерації HTML для списку випусків
function getIssuesContent(comicsName, vol) {
  // Це приклад, тут має бути динамічне завантаження списку випусків
  // В даному випадку використовуємо дані з JSON
  const issuesHTML = [];
  
  // Приклад даних для Amazing Spider-Man
  if (comicsName === "Дивовижна Людина-павук" && vol === "1") {
    for (let i = 1; i <= 3; i++) {
      issuesHTML.push(`
        <div class="issue-card">
          <div class="issue-cover">
            <img src="/api/placeholder/150/230" alt="${comicsName} #${i}">
          </div>
          <div class="issue-info">
            <h3>${comicsName} #${i}</h3>
            <a href="#/articles/comics/${comicsName} Том ${vol} ${i}" class="button-primary">Деталі</a>
          </div>
        </div>
      `);
    }
  } else {
    // Для інших випусків
    issuesHTML.push(`<p>Інформація про випуски буде додана пізніше.</p>`);
  }
  
  return issuesHTML.join('');
}

// Домашня сторінка
function renderHomePage() {
  // Вже наявний HTML у index.html для домашньої сторінки
  // Нічого не робимо, оскільки контент вже відображається
  updateActiveNavItem();
}

// Сторінка серій коміксів
function renderComicsPage() {
  let content = `
    <div class="page-header">
      <h1>Серії коміксів</h1>
    </div>
    <div class="comics-grid large-grid">
      <div class="comic-card">
        <div class="comic-cover">
          <img src="/api/placeholder/200/300" alt="Дивовижна Людина-павук">
        </div>
        <div class="comic-info">
          <h3>Дивовижна Людина-павук</h3>
          <p>Том 1</p>
          <a href="#/articles/comics/Дивовижна Людина-павук Том 1" class="button-primary">Деталі</a>
        </div>
      </div>
      
      <div class="comic-card">
        <div class="comic-cover">
          <img src="/api/placeholder/200/300" alt="Месники">
        </div>
        <div class="comic-info">
          <h3>Месники</h3>
          <p>Том 1</p>
          <a href="#/articles/comics/Месники Том 1" class="button-primary">Деталі</a>
        </div>
      </div>
      
      <div class="comic-card">
        <div class="comic-cover">
          <img src="/api/placeholder/200/300" alt="Люди Ікс">
        </div>
        <div class="comic-info">
          <h3>Люди Ікс</h3>
          <p>Том 1</p>
          <a href="#/articles/comics/Люди Ікс Том 1" class="button-primary">Деталі</a>
        </div>
      </div>
      
      <div class="comic-card">
        <div class="comic-cover">
          <img src="/api/placeholder/200/300" alt="Фантастична четвірка">
        </div>
        <div class="comic-info">
          <h3>Фантастична четвірка</h3>
          <p>Том 1</p>
          <a href="#/articles/comics/Фантастична четвірка Том 1" class="button-primary">Деталі</a>
        </div>
      </div>
    </div>
  `;
  
  contentContainer.innerHTML = content;
  updateActiveNavItem();
}

// Сторінка персонажів
function renderCharactersPage() {
  let content = `
    <div class="page-header">
      <h1>Персонажі</h1>
    </div>
    <div class="characters-grid large-grid">
      <div class="character-card">
        <div class="character-avatar">
          <img src="/api/placeholder/150/150" alt="Людина-павук">
        </div>
        <h3>Людина-павук</h3>
        <a href="#/articles/characters/Людина-павук" class="button-secondary">Профіль</a>
      </div>
      
      <div class="character-card">
        <div class="character-avatar">
          <img src="/api/placeholder/150/150" alt="Залізна людина">
        </div>
        <h3>Залізна людина</h3>
        <a href="#/articles/characters/Залізна-людина" class="button-secondary">Профіль</a>
      </div>
      
      <div class="character-card">
        <div class="character-avatar">
          <img src="/api/placeholder/150/150" alt="Капітан Америка">
        </div>
        <h3>Капітан Америка</h3>
        <a href="#/articles/characters/Капітан-Америка" class="button-secondary">Профіль</a>
      </div>
      
      <div class="character-card">
        <div class="character-avatar">
          <img src="/api/placeholder/150/150" alt="Тор">
        </div>
        <h3>Тор</h3>
        <a href="#/articles/characters/Тор" class="button-secondary">Профіль</a>
      </div>
    </div>
  `;
  
  contentContainer.innerHTML = content;
  updateActiveNavItem();
}

// Сторінка творців
function renderCreatorsPage() {
  let content = `
    <div class="page-header">
      <h1>Творці</h1>
    </div>
    <div class="creators-grid">
      <div class="creator-card">
        <div class="creator-avatar">
          <img src="/api/placeholder/150/150" alt="Stan Lee">
        </div>
        <h3>Stan Lee</h3>
        <p>Сценарист, Редактор</p>
        <a href="#/creators/stan-lee" class="button-secondary">Профіль</a>
      </div>
      
      <div class="creator-card">
        <div class="creator-avatar">
          <img src="/api/placeholder/150/150" alt="Steve Ditko">
        </div>
        <h3>Steve Ditko</h3>
        <p>Художник, Сценарист</p>
        <a href="#/creators/steve-ditko" class="button-secondary">Профіль</a>
      </div>
      
      <div class="creator-card">
        <div class="creator-avatar">
          <img src="/api/placeholder/150/150" alt="Jack Kirby">
        </div>
        <h3>Jack Kirby</h3>
        <p>Художник</p>
        <a href="#/creators/jack-kirby" class="button-secondary">Профіль</a>
      </div>
    </div>
  `;
  
  contentContainer.innerHTML = content;
  updateActiveNavItem();
}

// Налаштування роутера
router
  .on('/', () => {
    renderHomePage();
  })
  .on('/comics', () => {
    renderComicsPage();
  })
  .on('/issues', () => {
    contentContainer.innerHTML = '<h1>Випуски</h1><p>Сторінка в розробці</p>';
    updateActiveNavItem();
  })
  .on('/characters', () => {
    renderCharactersPage();
  })
  .on('/creators', () => {
    renderCreatorsPage();
  })
  .on('/articles/characters/:character', (match) => {
    renderPage('characters', match.data.character);
  })
  .on('/articles/comics/:comics', (match) => {
    const comics_name = match.data.comics.split(' Том')[0]; // Дивовижна Людина-павук
    let vol = match.data.comics.split('Том ')[1]; // 1_1 або 1
    let issue;
    
    if (vol && vol.includes(' ')) {
      [vol, issue] = vol.split(' ');
      renderPageData('issue', match.data.comics, comics_name, vol, issue);
    } else {
      renderPageData('comics', match.data.comics, comics_name, vol);
    }
  })
  .notFound(() => {
    contentContainer.innerHTML = '<h1>Сторінка не знайдена</h1>';
    updateActiveNavItem();
  })
  .resolve();

// Обробка зміни URL для оновлення активного пункту меню
window.addEventListener('hashchange', updateActiveNavItem);