import { EventEmitter } from "events";
import { Topics } from "../_model/Topics";
import io from "socket.io";
import Peer from "peer";

function ChatProxy() {
    EventEmitter.call(this);
    this._peers = {};
}

ChatProxy.prototype = Object.create(EventEmitter.prototype);

ChatProxy.prototype.onMessage = (cb) => {
    this.addListener(Topics.USER_MESSAGE, cb);
}

ChatProxy.prototype.getUsername = () => {
    return this._username;
}

ChatProxy.prototype.setUsername = (username) => {
    this._username = username;
}

ChatProxy.prototype.onUserConnected = (cb) => {
    this.addListener(Topics.USER_CONNECTED, cb);
}

ChatProxy.prototype.onUserDisconnected = (cb) => {
    this.addListener(Topics.USER_DISCONNECTED, cb);
}

ChatProxy.prototype.send = (user, message) => {
    this._peers[user].send(message);
    this._peers.forEach(element => {
        
    });
}

ChatProxy.prototype.broadcast = (msg) => {
    this._peers.forEach(peer => {
        this.send(peer, msg);
    });
}

ChatProxy.prototype._connectTo = function (username) {
    var conn = this.peer.connect(username);
    conn.on('open', function () {
      this._registerPeer(username, conn);
    }.bind(this));
};
  
ChatProxy.prototype._registerPeer = function (username, conn) {
    console.log('Registering', username);
    this._peers[username] = conn;
    conn.on('data', function (msg) {
      console.log('Messaga received', msg);
      this.emit(Topics.USER_MESSAGE, { content: msg, author: username });
    }.bind(this));
};
  
ChatProxy.prototype._disconnectFrom = function (username) {
    delete this._peers[username];
};

ChatProxy.prototype.connect = (username) => {
    const self = this;
    this.setUsername(username);
    this.socket = io();
    this.socket.on('connect', () => {
        self.socket.on(Topics.USER_CONNECTED, (userID) => {
            if (userID === self.getUsername()) return;
            self._connectTo(userID);
            self.emit(Topics.USER_CONNECTED, userID);
            console.log('User connected', userID);
        })
        self.socket.on(Topics.USER_DISCONNECTED, (userID) => {
            if ( userID === self.getUsername()) return;
            self._disconnectFrom(userID);
            self.emit(Topics.USER_DISCONNECTED, userID);
            console.log('User disconnected', userID);
        })
    })

    console.log('Connecting with username', username);
    this.peer = new Peer(username, {
        host: "localhost",
        port: 9000,
        path: '/chat'
    });
    this.peer.on('open', (userID) => {
        self.setUsername(userID);
    });
    this.peer.on('connection', (conn) => {
        self._registerPeer(conn.peer, conn);
        self.emit(Topics.USER_CONNECTED, conn.peer);
    });
}