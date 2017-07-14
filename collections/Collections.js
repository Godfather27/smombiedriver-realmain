
// {_id: UUID, question: string, answer: string}
Dialog = new Mongo.Collection('dialog');

// {_id_ UUID, room_id: random_string, app_connected: bool}
Rooms = new Mongo.Collection('rooms');

// {_id: UUID, room_id: fk.rooms, points: int}
Points = new Mongo.Collection('points')