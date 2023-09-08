const express = require("express");
const http = require("http");
const https = require("https");
const bodyParser = require("body-parser");
const { RtcTokenBuilder, RtcRole } = require("agora-token");
const { Server } = require("socket.io");
const fs = require("fs");

const privateKey = process.env.NODE_ENV == "production" ? fs.readFileSync("/etc/letsencrypt/live/learningapi.uttamsdarji.online/privkey.pem", "utf8") : "";
const certificate = process.env.NODE_ENV == "production" ? fs.readFileSync("/etc/letsencrypt/live/learningapi.uttamsdarji.online/cert.pem", "utf8") : "";
const ca = process.env.NODE_ENV == "production" ? fs.readFileSync("/etc/letsencrypt/live/learningapi.uttamsdarji.online/chain.pem", "utf8") : "";

let remoteUsersData = {};

const prompts = ["No attendee has joined yet. Share the meeting link with the attendees", "Attendee Y expresses difficulty in staying motivated. Suggest techniques to maintain motivation and overcome procrastination.", "Attendee Z is struggling with time management. Recommend effective time-blocking strategies to enhance productivity.", "Attendee A mentions trouble with work-life balance. Share insights on setting boundaries and prioritizing personal and professional commitments.", "Attendee B is interested in improving communication skills. Offer advice on active listening techniques and effective ways to express ideas.", "Attendee C is feeling overwhelmed by a heavy workload. Propose methods to manage stress and handle multiple tasks efficiently.", "Attendee D wants to enhance their public speaking abilities. Provide tips for building confidence and delivering compelling presentations.", "Attendee E is looking for ways to improve problem-solving skills. Share a practical approach to tackle complex issues methodically.", "Attendee F is keen to learn about self-motivation. Suggest resources and strategies for maintaining a positive mindset and staying motivated.", "Attendee G is experiencing difficulties in setting and achieving long-term goals. Offer guidance on SMART goal setting and tracking progress.", "Attendee H is interested in enhancing leadership skills. Recommend books, courses, or exercises to develop leadership qualities and influence effectively."];

const app = express();

const rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};
app.use(bodyParser.json({ verify: rawBodySaver, extended: true }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", async (req, res) => {
  res.send("Group Call");
});

let promptIndex = 0;

const initiatePrompts = () => {
  io.emit("promptForCoach", prompts[promptIndex]);
  promptIndex++;
  if (prompts.length > promptIndex) {
    setTimeout(() => {
      initiatePrompts();
    }, 10000);
  } else {
    promptIndex = 0;
  }
};

app.get("/intiate-prompts", async (req, res) => {
  initiatePrompts();
  res.json({
    success: true,
    message: "Prompts Initiated",
  });
});

APP_ID = "07d64092f3d24c3aa528ba0fc23d3b2b";
APP_CERTIFICATE = "704288d952d34b03b6cce1e335eca6a1";

app.get("/fetch-token", async (req, res) => {
  let channelName = req.query.channelName;
  let username = req.query.username;
  let skills = req.query.skills;
  let uid = req.query.uid;
  let userType = req.query.userType;
  const role = RtcRole.PUBLISHER;
  const appId = APP_ID;
  const appCertificate = APP_CERTIFICATE;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
  let resData = {
    token,
  };
  let userData = {
    username,
    skills,
    userType,
  };
  remoteUsersData = {
    ...remoteUsersData,
    [channelName]: remoteUsersData[channelName]
      ? {
          ...remoteUsersData[channelName],
          [uid]: userData,
        }
      : {
          [uid]: userData,
        },
  };
  io.emit("userDataUpdate", remoteUsersData);
  res.json(resData);
});

const credentials = { key: privateKey, cert: certificate, ca: ca };

let httpServer = http.createServer(app);
let httpsServer = https.createServer(credentials, app);

const io = new Server(process.env.NODE_ENV == "production" ? httpServer : httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", socket => {
  // console.log("webscoket connected");
});

if (process.env.NODE_ENV == "production") {
  httpsServer.listen(443, () => {
    console.log(`HTTPS Server app listening on port 443`);
  });
  httpServer.listen(80, () => {
    console.log(`HTTP Server app listening on port 80`);
  });
} else {
  httpServer.listen(3002, () => {
    console.log(`Group Video Conference listening on 3002`);
  });
}
