
CREATE TABLE "user" (
    "id" INTEGER PRIMARY KEY,
    "first_name" VARCHAR (255) DEFAULT ('missing_na'),
    "last_name" VARCHAR (255) DEFAULT ('missing_na'),
    "token" VARCHAR (255) NOT NULL
);

INSERT INTO "user" ("id", "first_name", "last_name", "token")
VALUES (101, 'Jan', 'Klaassen', '1BCD');
INSERT INTO "user" ("id", "first_name", "last_name", "token")
VALUES (102, 'Klaas', 'Erikson', 'A2CD');
INSERT INTO "user" ("id", "first_name", "last_name", "token")
VALUES (103, 'Erik', 'Pietson', 'AB3D');
INSERT INTO "user" ("id", "first_name", "last_name", "token")
VALUES (104, 'Piet', 'Janssen', 'ABC4');

CREATE TABLE "token" (
    "id" INTEGER PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "total" INTEGER NOT NULL,
    FOREIGN KEY ("owner_id") REFERENCES "user"("id")
);

INSERT INTO "token" ("id", "name", "owner_id", "total")
VALUES (201, 'Kindpakket Token', 101, 6000000);

CREATE TABLE "wallet" ( 
    "id" INTEGER PRIMARY KEY,
    "amount" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("token_id") REFERENCES "token"("id"),
    FOREIGN KEY ("user_id") REFERENCES "user"("id")
);

INSERT INTO "wallet" ("id", "amount", "token_id", "user_id")
VALUES (201, 100000, 201, 101);
INSERT INTO "wallet" ("id", "amount", "token_id", "user_id")
VALUES (202, 200, 201, 102);
INSERT INTO "wallet" ("id", "amount", "token_id", "user_id")
VALUES (203, 1000, 201, 103);