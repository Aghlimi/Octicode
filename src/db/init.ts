import db from "./sqlite";

function databaseInit() {
    db.exec(`
        create table if not exists patients (
            id text primary key,
            name text,
            age integer,
            address text
        );
        create table if not exists summaries (
            id text primary key,
            recordId text,
            patientId text,
            doctorId text,
            summaryText text
        );
        create table if not exists records (
            id text primary key,
            date text,
            size integer,
            patientId text,
            doctorId text
        );
    `);
}

export default databaseInit;