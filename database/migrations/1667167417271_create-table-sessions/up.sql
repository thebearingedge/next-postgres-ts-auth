create table "sessions" (
  "sessionId" text  not null,
  "userId"    integer not null,
  primary key ("sessionId"),
  foreign key ("userId")
   references "users" ("userId")
);
