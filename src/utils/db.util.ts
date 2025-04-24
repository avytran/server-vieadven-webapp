import knex, { Knex } from 'knex';  
 
 const config: { [key: string]: Knex.Config } = {  
   development: {  
     client: 'pg', 
     connection: {  
       host: 'localhost',   
       user: 'vieadvendev', 
       password: 'vieadvendev',
       database: 'vieadvenweb', 
       port: 5433,  
     }
   }
 };  
 
 const db = knex(config['development']); 
 
 export default db; 
