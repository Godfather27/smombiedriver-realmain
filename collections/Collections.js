
// {_id: UUID, dialog_line: int, message: string}
Dialog = new Mongo.Collection('dialog');

// {_id_ UUID, room_id: random_string}
Rooms = new Mongo.Collection('rooms');

// {_id: UUID, room_id: fk.rooms, points: int}
Points = new Mongo.Collection('points')