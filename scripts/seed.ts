import { db } from "../lib/db";
import { reseed } from "../lib/db/seed";

reseed(db);
console.log("Folio reseeded with example roles.");
