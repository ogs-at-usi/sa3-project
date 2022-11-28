const express = require('express');
const router = express.Router();
module.exports = router;
const ObjectID = require('mongodb').ObjectId;
const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { User } = require('../models/user');
const { Chat } = require('../models/chat');




router.get('/chats', async function (req, res) {
  // const test = "5e63c3a5e4232e4cd0274ac2";
  console.log("GINO");
  const chats = await UserChat.find({
    user: new ObjectId(req.userID),
  })
    .populate('chat')
    .exec();

  res.json(chats.map((userChat) => userChat.chat));

  res.render('index.html', { user: req.userID });
  // res.redirect('/');

  
});


router.get('/messages/:chatID', async function (req, res) {
  if (!ObjectID.isValid(req.params.chatID)) {
    return res.status(406).end();
  }

  try {
    const userChat = await UserChat.findOne({
      _id: new ObjectId(req.params.chatID),
      user: new ObjectId(req.userID),
    })
      .populate({
        path: 'chat',
        populate: {
          path: 'messages',
        },
      })
      .exec();

    if (userChat?.chat?.messages) {
      res.json(userChat.chat.messages);
    } else {
      res.status(422).end();
    }
  } catch (e) {
    // cant find the the chat with the user
    // error
    res.status(422).end();
  }
});

router.get('/users', async function (req, res) {
  const filter = req.query.filter ?? '';

  const searchedUsers = await User.find({
    name: filter,
  });

  res.json(searchedUsers);
});

router.post('/chat', async function (req, res) {
  
  const otherID = req.body.otherID;

  if (!ObjectID.isValid(otherID)) {
    return res.status(406).end();
  }

  const otherUser = await User.findOne({
    _id: ObjectId(otherID),
  });
  if (!otherUser) {
    return res.status(406).end();
  }

  const user = await User.findOne({
    _id: ObjectId(req.userID),
  });

  if (!user) {
    return res.status(406).end();
  }

  let otherUserChats = await UserChat.find({
    user: otherUser._id,
  })
    .populate('chat')
    .exec();
  otherUserChats = otherUserChats.map((userChat) => userChat.chat);

  let userChats = await UserChat.find({
    user: user._id,
  })
    .populate('chat')
    .exec();
  userChats = userChats.map((userChat) => userChat.chat);

  const commonChats = otherUserChats.filter(
    (value) =>
      userChats.findIndex(
        (uc) => uc._id.toString() === value._id.toString()
      ) !== -1
  );

  if (commonChats.length === 0) {
    // create
    const chat = await Chat.create({
      is_group: false,
      messages: [],
    });
    const chatID = chat._id;

    await UserChat.create({
      user: user._id,
      chat: chatID,
    });
    await UserChat.create({
      user: otherUser._id,
      chat: chatID,
    });

    res.json(chat);
  } else {
    // join
    res.status(204).json(commonChats);
  }
});
