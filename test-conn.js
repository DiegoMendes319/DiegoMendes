// test-conn.js
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
    const url = process.env.DATABASE_URL;
    const client = new Client({ connectionString: url });
    try {
        await client.connect();
        console.log('✅ Ligação bem‑sucedida!');
    } catch (e) {
        console.error('❌ Erro ao ligar:', e.message);
    } finally {
        await client.end();
    }
}

test();
