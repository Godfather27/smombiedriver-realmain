
// {_id: UUID, question: string, answer: string}
//Dialog = new Mongo.Collection('dialog');

// {_id: UUID, room_id: random_string, app_connected: bool}
Rooms = new Mongo.Collection('rooms');

// {_id: UUID, room_id: fk.rooms, points: int}
Points = new Mongo.Collection('points');

// {_id: UUID, room_id: fk.rooms, state: string}
GameStates = new Mongo.Collection('game_states');

// {_id: UUID, room_id: fk.rooms, notification_type: string, timestamp: unix-timestamp}
Notifications = new Mongo.Collection('notifications');