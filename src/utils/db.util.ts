import knex, { Knex } from 'knex';
import dotenv from 'dotenv'

dotenv.config()

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,  // Thay bằng host của Supabase hoặc PgBouncer
            user: process.env.DB_USER,               // Username Supabase
            password: process.env.DB_PASSWORD,   // Mật khẩu của bạn
            database: 'postgres',           // Tên database (ví dụ 'postgres')
            port: 5432,                     // Cổng kết nối PostgreSQL
            ssl: { rejectUnauthorized: false } // Bật SSL cho Supabase
        },
        pool: {
            min: 2,     // Số kết nối tối thiểu trong pool
            max: 10,    // Số kết nối tối đa trong pool
            acquireTimeoutMillis: 30000,  // Thời gian tối đa để chờ kết nối từ pool
            createTimeoutMillis: 3000,    // Thời gian tối đa để tạo kết nối mới
            idleTimeoutMillis: 10000,     // Thời gian tối đa một kết nối không được sử dụng sẽ bị giải phóng
        }
    }
};

const db = knex(config['development']);

export default db;
