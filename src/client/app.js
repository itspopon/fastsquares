import * as GameController from "./controllers/game";
import * as UserController from "./controllers/user";
import * as ChatController from "./controllers/chat";
import * as RoomController from "./controllers/room";

import GameRoom from "./models/gameRoom";
import User from "./models/user";

const socket = io();
socket.user = new User(socket.id);
/* --------- */

GameRoom.buildGrid();

GameController.playerMoved(socket);

GameController.objectiveCollected(socket);

GameController.playerMovement(socket);

GameController.roomCreated(socket);

GameController.enteringRoom(socket);

UserController.onLoginSubmit(socket);

UserController.onError(socket);

UserController.onEnterRoomSubmit(socket);

UserController.onCreateRoomSubmit(socket);

UserController.onLeaveRoom(socket);

RoomController.outOfLives(socket);

RoomController.onUserJoined(socket);

RoomController.onUserLeft(socket);

ChatController.onChatSubmit(socket);

ChatController.onNewMessage(socket);

