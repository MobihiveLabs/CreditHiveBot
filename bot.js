const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const util = require('util');
const { TOKEN } = require('dotenv');
const bot = new TelegramBot('6176673584:AAFQpmlW2wuNx4HlEkLL7op8qRJjjY3XXdE', { polling: true });
const express = require('express');
const app = express();
const port = 3000;

app.get('/' , (req , res ) =>{
  res.send("Hello From Docker!");
})

app.listen(port, () =>{
  console.log(`Bot app is listing on port ${port} `);
})




const chatId = "";
const wait = util.promisify(setTimeout);


bot.on('message', (ctx) => {
  console.log(ctx);
})




// Start command
bot.onText(/\/start/, (ctx) => {
  startMessage(ctx);
});

// Button handling
bot.on('callback_query', (query) => {
  try {

    const chatId = query.message.chat.id;
    const messageText = query.data;
    switch (messageText) {


      case 'device_Issue':
        // Handle device Issue
        bot.sendMessage(chatId, query.data);
        break;


      case 'account':
        // Handle account
        bot.sendMessage(chatId, 'You selected account.');
        break;


      case 'payment':
        // Handle payment
        bot.sendMessage(chatId, 'You selected payment.');
        break;


      case 'other':
        // Handle other
        bot.sendMessage(chatId, 'You selected other.');
        break;


      case 'chat_support':
        // Handle chat Support
        chat_support(query);

        break;

      case 'agent':
        // Handle Agent Token
        // sendOption(query);
        // bot.sendMessage(chatId, 'You selected Agent.');      
        bot.sendMessage(chatId, "Enter Your Agent Id ");
        processUserInput(chatId, query);


        // agentCheck(query,deviceId);
        break;


      case 'customer':
        // Handle Customer Token
        bot.sendMessage(chatId, 'You selected Customer.');
        break;


      default:
        // Handle other messages
        bot.sendMessage(chatId, 'Sorry, I did not understand your message.');
        break;
    }
  } catch (error) {
    console.log(error);
  }
});





bot.on('callback_query', (query) => {
  try {

    const chatId = query.message.chat.id;
    const messageText = query.data;
    switch (messageText) {

    }
  } catch (error) {
    console.log(error);
  }
});



















// Run the bot
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot started successfully!');






// Functions 

// Function to wait for user input
function waitForUserInput(chatId) {
  return new Promise((resolve, reject) => {
    bot.once('message', (ctx) => {
      if (ctx.chat.id === chatId) {
        resolve(ctx.text);
      }
    });
  });
}


// Example function using waitForUserInput
async function processUserInput(chatId, ctx) {
  try {
    // const question = "Enter Your Agent ID Please."
    // await bot.sendMessage(chatId, question);
    const deviceId = await waitForUserInput(chatId);

    try {
      if (deviceId.length == 6) {
        console.log('User input:', deviceId);
        agentCheck(deviceId, ctx);

      } else {
        const wrongDeviceId = () => {
          bot.sendMessage(chatId, "Please Enter Correct Device ID ");
          setTimeout(() => {

            processUserInput(chatId);

          }, 2000);
          return deviceId;
        }
        wrongDeviceId();
        return;
      }

    } catch (err) {
      console.log(err);
    }

    // Process the user's input further
  } catch (error) {
    console.error('Error:', error);
  }
}
//For welcomeOptions
function welcomeMsgOption(ctx) {
  const chatId = ctx.message.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '1. Device Issue', callback_data: 'device_Issue' }],
        [{ text: '2. Account', callback_data: 'account' }],
        [{ text: '3. Payment', callback_data: 'payment' }],
        [{ text: '4. Other', callback_data: 'other' }],
        [{ text: '5. Chat Support', callback_data: 'chat_support' }],
      ],
      resize_keyboard: false,
      one_time_keyboard: true
    }
  };

  setTimeout(() => {
    const followUpMessage = 'Select one option from the below.';
    bot.sendMessage(chatId, followUpMessage, options);
  }, 1000);
}

// To send Option as a message to bot

function sendOption(ctx) {
  //Logic for option shows from customer text

}


//Function for AgentCheck and token

function agentCheck(deviceId, ctx) {
  // const ctx = msg;
  // const chatId = ctx.message.chat.id;
  console.log(chatId);

  bot.sendMessage(chatId, `${deviceId}`);
  //If 
  //   if(deviceId == search device id from database){

  //   }else{
  //     //Give him a token and Save to database.
  //   }
  // }

  welcomeMsgOption(ctx);
}
function startMessage(ctx) {
  try {

    const chatId = ctx.chat.id;
    const firstName = ctx.from.first_name;

    const welcomeMessage = `Hi ${firstName}! Welcome to CreditHive Customer care bot. How can I assist you today?`;
    bot.sendMessage(chatId, welcomeMessage);

    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '1. Agent', callback_data: 'agent' }],
          [{ text: '2. Customer', callback_data: 'customer' }],
        ],
        resize_keyboard: false,
        one_time_keyboard: true
      },

    };
    setTimeout(() => {
      bot.sendMessage(chatId, "Choose the one that best describes you.", options);
    }, 1000);

  } catch (error) {
    console.log(error);
  }
}


// Return a random chat Id to chat_support
function getRandomChatId(filename) {
  try {
    const jsonData = fs.readFileSync(filename, 'utf8');
    const data = JSON.parse(jsonData);
    const number = Object.values(data);
    const keys = Object.keys(data);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return number[randomIndex];
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return null;
  }
}

// Function for Return representative Name 

function getNameOfRep(filename) {
  try {
    const jsonData = fs.readFileSync(filename, 'utf8');
    const data = JSON.parse(jsonData);
    const number = Object.values(data);
    const keys = Object.keys(data);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return null;
  }

}




// Chat Support function 

async function chat_support(ctx) {
  const chatId = ctx.message.chat.id;
  bot.sendMessage(chatId, 'You selected chat Support.');
  const repChatId = getRandomChatId('\list.json'); // Replace with the chat ID of the representative
  const repName = getNameOfRep('\list.json');
  await wait(2000);
  bot.sendMessage(chatId, `You are now speaking to ${repName}`);
  bot.on('message', (ctx) => {
    if (ctx.chat.id === chatId) {
      bot.forwardMessage(repChatId, chatId, ctx.message_id);
    }
  });
  // Forward representative messages to the customer
  bot.on('message', (ctx) => {
    const text = ctx.text;

    if (ctx.chat.id === repChatId) {
      bot.forwardMessage(chatId, repChatId, ctx.message_id);
    } else if (text == "stop" || "Stop") {

    }
  });
}


