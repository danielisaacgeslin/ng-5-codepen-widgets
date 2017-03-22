var conn = new Mongo();
var db = conn.getDB('user');

db.users.insert({
  "_id": ObjectId("58515c872fcaaf2500479259"),
  "username": "seedtag",
  "country": "ES",
  "name": "seedtag",
  "surname": "dev",
  "password": "$2a$10$BSkHlfPvtN9791zpU0i7RO2gDMY5vY7rOxFDMrEnN4bLVFf5xuara", // "seedtag"
  "email": "dev+seedtag@seedtag.com",
  "permissions": [
    "admin"
  ],
  "publishers": [ ],
  "status": "active",
  "__v": 1,
  "apiKey": "e947f68afb0371afe92acf3fbcc541e31f0506b878ea765de51bea322ae8b56a6fb5e9efaa5236416fa14c6e27233e7c",
  "resetPasswordToken": "$2a$10$jtc0uY4DHI4n9MZt2vb.GeM2PTuoqF2idiGy/4E7eZRyhoF.l5zO2",
  "resetPasswordTokenExpirationTime": ISODate("2016-12-14T15:00:53.908Z")
});
