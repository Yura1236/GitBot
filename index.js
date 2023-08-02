const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const botToken = '5952261623:AAHPfXwpiRNvA-EY-4SPvcqRsnG1-9rumOk'; // Замените на ваш токен доступа
const bot = new TelegramBot(botToken, { polling: true });

const youtubeApiKey = 'AIzaSyDd198j22kGGV18rKGXiN7rBATCS0gMXn4'; // Замените на ваш ключ API для YouTube Data API



bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  subscribers.add(msg.from.id);
  if(msg.text!==('/start2')){
  bot.sendMessage(chatId, `цей бот спеціально создан для старомаяківських бандітів`);
  }
  
  const keyboard = {
    reply_markup: {
      keyboard: [
        ['Юра', 'Кнопка 2'],
        ['Кнопка 3', 'Кнопка 4'],
        ['Кнопка 5', 'Кнопка 6','Кнопка 7'],
        ['Режим администратора'],
      ],
      resize_keyboard: true,
      
    },
  };
if(msg.text!==('/start2')){
  bot.sendMessage(chatId, 'Привет! Выберите действие:', keyboard);
}
});

// Обработчики кнопок
bot.onText(/Юра/, (msg) => {
  const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Вы выбрали кнопку Юра');
     bot.sendPhoto(chatId, 'img/01.jpg', { caption: 'Вы выбрали кнопку 4 и это фото!' });
});
bot.onText(/Кнопка 2/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Вы выбрали кнопку 2');

  bot.sendMessage(chatId, 'Добро пожаловать! Выберите действие:', {
    reply_markup: {
      // InlineKeyboard с одной кнопкой
      inline_keyboard: [
        [
          // Объект с данными о кнопке
          {
            text: 'Нажми меня!',
            // Данные для обработки нажатия кнопки, можно указать любое значение
            callback_data: 'button_pressed',
          },
        ],
      ],
    },
  });
  
});


bot.onText(/Кнопка 4/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Вы выбрали кнопку 4');
});





// Обработчик нажатий на кнопку чата
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  // Обработка нажатия кнопки с идентификатором 'button_pressed'
  if (query.data === 'button_pressed') {
    bot.sendMessage(chatId, 'Вы нажали кнопку!');
  }
});










// Хранение списка подписчиков
const subscribers = new Set();
let isAdminMode = false; // Флаг режима администратора

bot.onText(/Режим администратора/, (msg) => {
  const isAdmin = isUserAdmin(msg.from.id);
  if (isAdmin) {
  isAdminMode = !isAdminMode;
  
  if (isAdminMode) {
    bot.sendMessage(msg.chat.id, 'Адмінка включена :)');
  } else {

    bot.sendMessage(msg.chat.id, 'Адмінка виключена :(');
  }
  }
  else{  bot.sendMessage(msg.chat.id, 'ви не є адмін');}

});

// Функция для проверки, является ли пользователь администратором
function isUserAdmin(userId) {
  const adminUserIds = [1116787237]; 
  return adminUserIds.includes(userId);
}
// Обработка всех сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Если режим администратора включен и отправитель администратор
  if (isAdminMode && isUserAdmin(msg.from.id)) {
    const messageText = msg.text;
    const messageOptions = {
      caption: messageText, // Текст сообщения для фото/видео/аудио
    };

    // Проверяем тип сообщения и отправляем соответствующий медиафайл всем подписчикам
    if (msg.photo) {
      // Если сообщение содержит фото
      const photoId = msg.photo[msg.photo.length - 1].file_id;
      subscribers.forEach((subscriberId) => {
        bot.sendPhoto(subscriberId, photoId, messageOptions);
      });
    } else if (msg.video) {
      // Если сообщение содержит видео
      const videoId = msg.video.file_id;
      subscribers.forEach((subscriberId) => {
        bot.sendVideo(subscriberId, videoId, messageOptions);
      });
    } else if (msg.audio) {
      // Если сообщение содержит аудио (голосовое сообщение)
      const audioId = msg.audio.file_id;
      subscribers.forEach((subscriberId) => {
        bot.sendVoice(subscriberId, audioId, messageOptions);
      });
    } else if (messageText && messageText.trim() !== '' && messageText !== 'Режим администратора') {
      // Если сообщение текстовое (и не является командой "Режим администратора")
      subscribers.forEach((subscriberId) => {
        bot.sendMessage(subscriberId, `📢 Администратор сообщает:\n${messageText}`);
      });
    }
  }
});






































// Обработка ошибок опроса
bot.on('polling_error', (error) => {
  console.log(`Polling error: ${error.message}`);
});



























// Глобальная переменная для отслеживания состояния функции поиска музыки
let musicSearchEnabled = false;

let textMessageSent = false; // Добавляем переменную для отслеживания показа сообщения

// Обработчик команды /Кнопка 3/
bot.onText(/Кнопка 3/, (msg) => {
  const chatId = msg.chat.id;
  musicSearchEnabled = !musicSearchEnabled; // Переключаем состояние функции поиска музыки
  const status = musicSearchEnabled ? 'включена, вводите текст песни:' : 'выключена';
 bot.sendMessage(chatId, ` Функция поиска музыки ${status}`);
  if (!textMessageSent) {
    bot.sendMessage(chatId, `Привет! Я бот, который поможет тебе найти музыку по строчкам песни. Просто отправь мне текст песни, и я постараюсь найти соответствующие треки на YouTube Music! Для отключения нажмите повторно на "Кнопка 3"`);
    textMessageSent = true; // Устанавливаем флаг, что сообщение было показано
  }

 
});

// Обработчик текстовых сообщений с текстом песни
bot.onText(/^(?!\s*$).+/, async (msg) => {
  if (musicSearchEnabled && msg.text !== 'Кнопка 3' && msg.text !== '/start') { // Проверяем, активна ли функция поиска музыки
    const chatId = msg.chat.id;
    const songLyrics = msg.text;

    // Поиск музыки на YouTube Music по тексту песни
    const searchResults = await searchYouTubeMusic(songLyrics);
    if (searchResults.length > 0) {
      let response = 'Вот некоторые треки, которые удалось найти по тексту песни:\n\n';
      searchResults.forEach((result, index) => {
        response += `${index + 1}. ${result.title} - ${result.channel}\n`;
      });
      bot.sendMessage(chatId, response);
    } else {
      bot.sendMessage(chatId, 'По вашему запросу ничего не найдено.');
    }
  }
});


// Функция для поиска музыки на YouTube Music по тексту песни
async function searchYouTubeMusic(query) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: youtubeApiKey,
        q: query,
        type: 'audio',
        part: 'snippet',
        maxResults: 5
      }
    });

    const searchResults = response.data.items.map(item => {
      return {
        title: item.snippet.title,
        channel: item.snippet.channelTitle
      };
    });

    return searchResults;
  } catch (error) {
    console.error('Ошибка при поиске музыки на YouTube Music:', error);
    return [];
  }
}