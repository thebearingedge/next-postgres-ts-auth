create table "users" (
  "userId"         serial,
  "username"       text not null,
  "hashedPassword" text not null,
  primary key ("userId"),
  unique ("username")
);
