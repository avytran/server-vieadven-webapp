import knex, { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {
            host: 'aws-0-ap-southeast-1.pooler.supabase.com',  // Thay bằng host của Supabase hoặc PgBouncer
            user: 'postgres.oycqdxhlckxpebthkdhc',               // Username Supabase
            password: 'etclubweb',   // Mật khẩu của bạn
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
