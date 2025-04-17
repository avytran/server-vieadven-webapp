import knex, { Knex } from 'knex';  
 
 const config: { [key: string]: Knex.Config } = {  
   development: {  
     client: 'pg', 
     connection: {  
       host: 'localhost',   
       user: 'etclubdev', 
       password: 'etclubdev',
       database: 'etclubweb', 
       port: 5432,  
     }
   }
 };  
 
 const db = knex(config['development']); 
 
 export default db; 