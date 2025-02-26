// data-service.js
export class DataService {
  constructor() {
    this.comics = {};
    this.characters = {};
    this.creators = {};
    this.issues = {};
  }
  
  // Завантаження даних з JSON
  async loadData() {
    try {
      const response = await fetch('data/comics.json');
      const data = await response.json();
      
      // Обробка даних
      this.parseComics(data);
      
      return true;
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
      return false;
    }
  }
  
  // Обробка даних коміксів
  parseComics(data) {
    // Зберігаємо дані випусків за томами
    for (const [seriesId, issues] of Object.entries(data)) {
      // Тут ми знаємо, що ключ "1" - це серія Дивовижна Людина-павук
      if (seriesId === "1") {
        const seriesName = "Дивовижна Людина-павук";
        const volume = "1";
        
        // Створюємо серію коміксів, якщо її ще не існує
        if (!this.comics[seriesName]) {
          this.comics[seriesName] = {};
        }
        
        // Додаємо том
        this.comics[seriesName][volume] = {
          name: seriesName,
          volume: volume,
          issuesCount: issues.length,
          issues: {}
        };
        
        // Додаємо випуски до тому
        for (const issue of issues) {
          const issueNumber = issue.id;
          
          // Зберігаємо дані випуску
          this.comics[seriesName][volume].issues[issueNumber] = {
            id: issueNumber,
            title: issue.story_title || `${seriesName} #${issueNumber}`,
            cover: issue.cover || '',
            release: issue.release || 'Невідомо',
            writers: this.extractCreators(issue, 'writer'),
            pencilers: this.extractCreators(issue, 'penciler'),
            inkers: this.extractCreators(issue, 'inker'),
            colorists: this.extractCreators(issue, 'colorist'),
            letterers: this.extractCreators(issue, 'letterer'),
            editors: this.extractCreators(issue, 'editor'),
            additionalStories: this.extractAdditionalStories(issue)
          };
          
          // Додаємо інформацію про творців
          this.processCreators(issue);
          
          // Додаємо інформацію про персонажів, якщо є
          this.processCharacters(issue, seriesName, volume, issueNumber);
        }
      } else if (seriesId === "2") {
        // Обробка інших серій коміксів (наприклад, "Месники")
        const seriesName = "Месники";
        const volume = "1";
        
        if (!this.comics[seriesName]) {
          this.comics[seriesName] = {};
        }
        
        this.comics[seriesName][volume] = {
          name: seriesName,
          volume: volume,
          issuesCount: issues.length,
          issues: {}
        };
        
        // Додавання випусків (аналогічно попередньому)
        for (const issue of issues) {
          // Аналогічна обробка як для серії 1
          // ...
        }
      }
      
      // Додаткові серії можна обробити аналогічно
    }
  }
  
  // Отримання творців з даних випуску (письменник, художник і т.д.)
  extractCreators(issue, role) {
    const creators = [];
    
    // Перевіряємо основне поле
    if (issue[role]) {
      const names = issue[role].split('\n').map(name => name.trim()).filter(name => name);
      creators.push(...names);
    }
    
    // Перевіряємо додаткові поля з суфіксом _2, _3, ...
    for (let i = 2; i <= 5; i++) {
      const key = `${role}_${i}`;
      if (issue[key]) {
        const names = issue[key].split('\n').map(name => name.trim()).filter(name => name);
        creators.push(...names);
      }
    }
    
    return creators;
  }
  
  // Отримання даних про додаткові історії
  extractAdditionalStories(issue) {
    const stories = [];
    
    if (issue.storys) {
      const story = {
        title: issue.storys.story_title2 || 'Додаткова історія',
        writers: [],
        pencilers: [],
        inkers: [],
        colorists: [],
        letterers: [],
        editors: []
      };
      
      // Додаємо дані про творців для додаткової історії
      if (issue.storys.writer2) story.writers = issue.storys.writer2.split('\n').map(name => name.trim()).filter(name => name);
      if (issue.storys.penciler2) story.pencilers = issue.storys.penciler2.split('\n').map(name => name.trim()).filter(name => name);
      if (issue.storys.inker2) story.inkers = issue.storys.inker2.split('\n').map(name => name.trim()).filter(name => name);
      if (issue.storys.colorist2) story.colorists = issue.storys.colorist2.split('\n').map(name => name.trim()).filter(name => name);
      if (issue.storys.letterer2) story.letterers = issue.storys.letterer2.split('\n').map(name => name.trim()).filter(name => name);
      if (issue.storys.editor2) story.editors = issue.storys.editor2.split('\n').map(name => name.trim()).filter(name => name);
      
      stories.push(story);
    }
    
    return stories;
  }
  
  // Обробка даних про творців
  processCreators(issue) {
    // Обробка всіх ролей творців
    const roles = ['writer', 'penciler', 'inker', 'colorist', 'letterer', 'editor'];
    
    for (const role of roles) {
      const creators = this.extractCreators(issue, role);
      
      for (const creatorName of creators) {
        if (!this.creators[creatorName]) {
          this.creators[creatorName] = {
            name: creatorName,
            roles: new Set(),
            issues: []
          };
        }
        
        // Додаємо роль, якщо її ще немає
        this.creators[creatorName].roles.add(role);
        
        // Додаємо випуск до списку робіт автора
        if (issue.id) {
          this.creators[creatorName].issues.push({
            series: "Дивовижна Людина-павук", // потрібно передавати як параметр для різних серій
            volume: "1",
            issue: issue.id,
            role: role
          });
        }
      }
    }
    
    // Обробка додаткових історій
    if (issue.storys) {
      // Аналогічно обробляємо творців додаткових історій
      // ...
    }
  }
  
  // Обробка даних про персонажів
  processCharacters(issue, seriesName, volume, issueNumber) {
    // Якщо у випуску є дані про персонажів
    if (issue.characters) {
      const characters = issue.characters.split(',').map(name => name.trim()).filter(name => name);
      
      for (const characterName of characters) {
        if (!this.characters[characterName]) {
          this.characters[characterName] = {
            name: characterName,
            realName: '',
            firstAppearance: '',
            appearances: []
          };
        }
        
        // Додаємо інформацію про появу персонажа
        this.characters[characterName].appearances.push({
          series: seriesName,
          volume: volume,
          issue: issueNumber
        });
      }
    }
  }
  
  // Методи для отримання даних
  
  // Отримання списку всіх серій коміксів
  getAllComicsSeries() {
    return Object.keys(this.comics).map(seriesName => {
      const volumes = Object.keys(this.comics[seriesName]).length;
      const firstVolume = Object.keys(this.comics[seriesName])[0];
      
      return {
        name: seriesName,
        volumes: volumes,
        firstVolume: firstVolume,
        issuesCount: this.comics[seriesName][firstVolume].issuesCount
      };
    });
  }
  
  // Отримання серії коміксів за назвою та томом
  getComicsSeries(name, volume) {
    if (this.comics[name] && this.comics[name][volume]) {
      return this.comics[name][volume];
    }
    return null;
  }
  
  // Отримання випуску за назвою серії, томом та номером
  getIssue(seriesName, volume, issueNumber) {
    if (this.comics[seriesName] && 
        this.comics[seriesName][volume] && 
        this.comics[seriesName][volume].issues[issueNumber]) {
      return this.comics[seriesName][volume].issues[issueNumber];
    }
    return null;
  }
  
  // Отримання списку всіх персонажів
  getAllCharacters() {
    return Object.values(this.characters);
  }
  
  // Отримання персонажа за іменем
  getCharacter(name) {
    return this.characters[name] || null;
  }
  
  // Отримання списку всіх творців
  getAllCreators() {
    return Object.values(this.creators).map(creator => {
      return {
        name: creator.name,
        roles: Array.from(creator.roles),
        issuesCount: creator.issues.length
      };
    });
  }
  
  // Отримання творця за іменем
  getCreator(name) {
    if (this.creators[name]) {
      const creator = this.creators[name];
      return {
        name: creator.name,
        roles: Array.from(creator.roles),
        issues: creator.issues
      };
    }
    return null;
  }
  
  // Отримання останніх доданих серій для головної сторінки
  getRecentSeries(limit = 4) {
    const allSeries = this.getAllComicsSeries();
    // В реальному додатку тут буде сортування за датою додавання
    // Зараз просто повертаємо перші N серій
    return allSeries.slice(0, limit);
  }
  
  // Пошук за назвою (для реалізації функції пошуку)
  search(query) {
    const results = {
      comics: [],
      characters: [],
      creators: []
    };
    
    const lowerQuery = query.toLowerCase();
    
    // Пошук серій коміксів
    for (const seriesName in this.comics) {
      if (seriesName.toLowerCase().includes(lowerQuery)) {
        for (const volume in this.comics[seriesName]) {
          results.comics.push({
            type: 'series',
            name: seriesName,
            volume: volume
          });
        }
      }
    }
    
    // Пошук персонажів
    for (const characterName in this.characters) {
      if (characterName.toLowerCase().includes(lowerQuery)) {
        results.characters.push({
          name: characterName
        });
      }
    }
    
    // Пошук творців
    for (const creatorName in this.creators) {
      if (creatorName.toLowerCase().includes(lowerQuery)) {
        results.creators.push({
          name: creatorName,
          roles: Array.from(this.creators[creatorName].roles)
        });
      }
    }
    
    return results;
  }
}

// Створення та експорт глобального екземпляру сервісу
export const dataService = new DataService();