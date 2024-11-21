create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);
create table boxer (
                      id integer primary key autoincrement ,
                      name text not null,
                      weight text not null,
                      record text not null
);