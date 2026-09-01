/**
 * GameHub Multiplayer Library
 * ----------------------------
 * Peer-to-peer multiplayer via PeerJS (WebRTC data channels).
 * No custom backend required – uses PeerJS cloud broker.
 *
 * Usage:
 *   const room = new GameRoom();
 *   // Host:
 *   room.create('tictactoe', { maxPlayers: 2 }, onEvent);
 *   // Joiner:
 *   room.join('ABC123', playerInfo, onEvent);
 *
 * Events emitted via onEvent(event, data):
 *   'room-update'  – player list or settings changed
 *   'game-start'   – host started the game
 *   'game-move'    – a player made a move
 *   'game-state'   – full game state sync (host → all)
 *   'player-left'  – a peer disconnected
 *   'error'        – something went wrong
 *   'connected'    – successfully joined as host or peer
 *   'chat'         – chat message received
 */

/* ─── Constants ──────────────────────────────────────────── */
const GH_PEER_PREFIX = 'gh-';   // PeerJS peer-ID prefix
const GH_VERSION     = '1';     // bumped if wire format changes

/* ─── Helpers ────────────────────────────────────────────── */
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function peerIdFromCode(code) {
  return GH_PEER_PREFIX + code.toUpperCase();
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

/* ─── Player defaults ────────────────────────────────────── */
const AVATARS = ['🎮','🦊','🐼','🦁','🐸','🦊','🌟','🔥','⚡','🎯','🏆','🎲'];
const COLORS  = ['#e94560','#00ff88','#00d4ff','#ff8844','#aa44ff',
                 '#ffff00','#ff6b6b','#4ecdc4','#45b7d1','#96ceb4'];

function defaultPlayer() {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('gh_player') || '{}'); }
    catch(e) { return {}; }
  })();
  return {
    id:     randomId(),
    name:   saved.name   || 'Player',
    avatar: saved.avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)],
    color:  saved.color  || COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

function savePlayerPrefs(p) {
  try { localStorage.setItem('gh_player', JSON.stringify({ name: p.name, avatar: p.avatar, color: p.color })); }
  catch(e) {}
}

/* ─── GameRoom class ─────────────────────────────────────── */
class GameRoom {
  constructor() {
    this._peer     = null;
    this._conns    = {};      // peerId → DataConnection (host has many; joiner has one)
    this._isHost   = false;
    this._code     = null;
    this._gameType = null;
    this._player   = defaultPlayer();
    this._players  = [];     // [{ ...playerInfo, slot: 0|1|… }]
    this._settings = {};
    this._cb       = null;   // event callback
    this._status   = 'idle'; // idle | lobby | started
    this._hostConn = null;   // joiners only – connection to host
  }

  /* ── Public getters ──────────────────────────────── */
  get code()     { return this._code; }
  get isHost()   { return this._isHost; }
  get players()  { return this._players; }
  get settings() { return this._settings; }
  get myPlayer() { return this._player; }
  get status()   { return this._status; }

  updateMyPlayer(data) {
    Object.assign(this._player, data);
    savePlayerPrefs(this._player);
    if (this._isHost) {
      const me = this._players.find(p => p.id === this._player.id);
      if (me) Object.assign(me, this._player);
      this._broadcastRoomUpdate();
    } else if (this._hostConn) {
      this._hostConn.send({ type: 'update-player', player: this._player });
    }
  }

  /* ── Create (host) ───────────────────────────────── */
  create(gameType, settings, cb, existingCode = null) {
    this._isHost   = true;
    this._gameType = gameType;
    this._settings = Object.assign({
      maxPlayers: 2,
      minPlayers: 2,
      botsEnabled: false,
    }, settings);
    this._cb = cb;
    this._code = existingCode ? existingCode.trim().toUpperCase() : generateRoomCode();

    const peerId = peerIdFromCode(this._code);
    this._peer = new Peer(peerId, _peerOptions());

    this._peer.on('open', () => {
      // Add host as first player
      this._player = Object.assign(this._player, { slot: 0 });
      this._players = [Object.assign({}, this._player)];
      this._status  = 'lobby';
      this._emit('connected', { code: this._code, player: this._player });
    });

    this._peer.on('connection', (conn) => {
      this._handleIncomingConn(conn);
    });

    this._peer.on('error', (err) => {
      this._emit('error', { message: err.message || String(err), raw: err });
    });
  }

  /* ── Join (peer) ─────────────────────────────────── */
  join(code, playerData, cb) {
    this._isHost   = false;
    this._code     = code.trim().toUpperCase();
    this._cb       = cb;
    if (playerData) Object.assign(this._player, playerData);

    const hostPeerId = peerIdFromCode(this._code);
    this._peer = new Peer(_peerOptions());   // random local peer ID

    this._peer.on('open', () => {
      const conn = this._peer.connect(hostPeerId, { reliable: true, serialization: 'json' });
      this._hostConn = conn;
      this._setupConn(conn, 'host');

      conn.on('open', () => {
        conn.send({ type: 'join', player: this._player, version: GH_VERSION });
      });
    });

    this._peer.on('error', (err) => {
      this._emit('error', { message: err.message || String(err), raw: err });
    });
  }

  /* ── Send a game move ────────────────────────────── */
  sendMove(moveData) {
    const msg = { type: 'game-move', player: this._player.id, data: moveData };
    if (this._isHost) {
      this._broadcast(msg);
    } else {
      if (this._hostConn) this._hostConn.send(msg);
    }
  }

  /* ── Broadcast full game state (host only) ───────── */
  sendState(stateData) {
    if (!this._isHost) return;
    this._broadcast({ type: 'game-state', state: stateData });
  }

  /* ── Update settings (host only) ────────────────── */
  updateSettings(newSettings) {
    if (!this._isHost) return;
    Object.assign(this._settings, newSettings);
    this._broadcastRoomUpdate();
  }

  /* ── Start the game (host only) ──────────────────── */
  startGame() {
    if (!this._isHost) return;
    this._status = 'started';
    const msg = { type: 'game-start', settings: this._settings, players: this._players };
    this._broadcast(msg);
    this._emit('game-start', msg);
  }

  /* ── Send chat message ──────────────────────────── */
  sendChat(text) {
    const msg = { type: 'chat', player: this._player, text, time: Date.now() };
    if (this._isHost) {
      this._broadcast(msg);
      // Do not emit locally here – the caller (lobby.html) appends the message
      // directly to avoid showing it twice for the host.
    } else {
      if (this._hostConn) this._hostConn.send(msg);
    }
  }

  /* ── Destroy / leave ────────────────────────────── */
  destroy() {
    Object.values(this._conns).forEach(c => { try { c.close(); } catch(e){} });
    if (this._peer) { try { this._peer.destroy(); } catch(e){} }
    this._status = 'idle';
  }

  /* ─────────────────────────────────────────────────
     Private helpers
  ───────────────────────────────────────────────── */

  _emit(event, data) {
    if (this._cb) {
      try { this._cb(event, data); } catch(e) { console.error('GameRoom cb error', e); }
    }
  }

  _broadcast(msg) {
    Object.values(this._conns).forEach(c => {
      if (c.open) { try { c.send(msg); } catch(e){} }
    });
  }

  _broadcastRoomUpdate() {
    const update = {
      type: 'room-update',
      players:  this._players,
      settings: this._settings,
      status:   this._status,
    };
    this._broadcast(update);
    this._emit('room-update', update);
  }

  _handleIncomingConn(conn) {
    this._setupConn(conn, 'peer');
  }

  _setupConn(conn, role) {
    const peerId = conn.peer;

    conn.on('open', () => {
      if (role === 'peer') this._conns[peerId] = conn;
    });

    conn.on('data', (msg) => {
      if (!msg || !msg.type) return;

      switch (msg.type) {
        /* ── Joiner → Host ── */
        case 'join':
          if (this._isHost) this._onPeerJoin(conn, msg);
          break;

        case 'update-player':
          if (this._isHost) {
            const p = this._players.find(x => x.id === msg.player.id);
            if (p) { Object.assign(p, msg.player); this._broadcastRoomUpdate(); }
          }
          break;

        case 'game-move':
          if (this._isHost) {
            // Relay to all OTHER peers (not back to sender)
            Object.values(this._conns).forEach(c => {
              if (c !== conn && c.open) { try { c.send(msg); } catch(e){} }
            });
          }
          this._emit('game-move', { player: msg.player, data: msg.data });
          break;

        case 'chat':
          if (this._isHost) {
            this._broadcast(msg);
            this._emit('chat', msg);
          } else {
            this._emit('chat', msg);
          }
          break;

        /* ── Host → Joiner ── */
        case 'welcome':
          if (!this._isHost) {
            this._player.slot = msg.slot;
            this._players     = msg.players;
            this._settings    = msg.settings;
            this._status      = 'lobby';
            this._emit('connected', { code: this._code, player: this._player });
            this._emit('room-update', { players: this._players, settings: this._settings, status: this._status });
          }
          break;

        case 'room-update':
          if (!this._isHost) {
            this._players  = msg.players;
            this._settings = msg.settings;
            this._status   = msg.status;
            this._emit('room-update', msg);
          }
          break;

        case 'game-start':
          if (!this._isHost) {
            this._status   = 'started';
            this._players  = msg.players;
            this._settings = msg.settings;
            this._emit('game-start', msg);
          }
          break;

        case 'game-state':
          this._emit('game-state', { state: msg.state });
          break;

        case 'player-left':
          this._players = this._players.filter(p => p.id !== msg.playerId);
          this._emit('player-left', { playerId: msg.playerId });
          this._emit('room-update', { players: this._players, settings: this._settings, status: this._status });
          break;
      }
    });

    conn.on('close', () => {
      if (role === 'peer' && this._isHost) {
        const leftPlayer = this._players.find(p => {
          // match by the DataConnection peer id we stored on join
          return this._conns[peerId] === conn;
        });
        delete this._conns[peerId];
        const leftMsg = { type: 'player-left', playerId: leftPlayer ? leftPlayer.id : peerId };
        if (leftPlayer) {
          this._players = this._players.filter(p => p.id !== leftPlayer.id);
        }
        this._broadcast(leftMsg);
        this._emit('player-left', leftMsg);
        this._emit('room-update', { players: this._players, settings: this._settings, status: this._status });
      } else if (role === 'host') {
        this._emit('error', { message: 'Disconnected from host.' });
      }
    });

    conn.on('error', (err) => {
      this._emit('error', { message: err.message || String(err), raw: err });
    });
  }

  _onPeerJoin(conn, msg) {
    const maxP = this._settings.maxPlayers || 2;
    if (this._players.length >= maxP) {
      conn.send({ type: 'error', message: 'Room is full.' });
      conn.close();
      return;
    }

    const slot   = this._players.length;
    const player = Object.assign({}, msg.player, { slot });
    this._players.push(player);
    this._conns[conn.peer] = conn;

    // Welcome the new peer
    conn.send({
      type:    'welcome',
      slot,
      players:  this._players,
      settings: this._settings,
    });

    // Notify everyone else
    this._broadcastRoomUpdate();
  }
}

/* ─── PeerJS options ─────────────────────────────────────── */
function _peerOptions() {
  return {
    // Use the default PeerJS cloud broker
    debug: 0,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    },
  };
}

/* ─── Convenience: save / load room info from sessionStorage */
const RoomSession = {
  save(code, role, gameType, player, settings) {
    sessionStorage.setItem('gh_room', JSON.stringify({ code, role, gameType, player, settings }));
  },
  load() {
    try { return JSON.parse(sessionStorage.getItem('gh_room') || 'null'); }
    catch(e) { return null; }
  },
  clear() { sessionStorage.removeItem('gh_room'); },
};

/* ─── Exports (works as plain global or ES module) ──────── */
if (typeof module !== 'undefined') {
  module.exports = { GameRoom, RoomSession, generateRoomCode, defaultPlayer, savePlayerPrefs, AVATARS, COLORS };
}
