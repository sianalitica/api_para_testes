import Config from "./libs/config";
import {mysqli, addPool} from "./libs/mysqli";

const database = Config.instance().getDatabase();

(async () => {

    addPool({
        alias:"main",
        host:database.host,
        user:database.user,
        pass:database.pass,
        database:database.name
    })
    
    /**
     * teste com consultas diferentes usando a mesma query e a mesma conexão
     */
    const conn = mysqli()
    conn.query("select * from test where valor = ?")
    let res1 = await conn.bind(['test1']).exec<{valor:string}>()
    let res2 = await conn.bind(['test2']).exec<{valor:string}>()


    /**
     * teste com mais uma consulta diferente usando a mesma conexão
     */
    let res3 = await conn.query("select * from test").exec<{valor:string}>()

    if(res1.status() && res2.status()){
        console.log(res1.getRows()[0].valor)
        console.log(res2.getRows()[0].valor)
    } else {
        console.log(res1.getDataError())
        console.log(res2.getDataError())
    }

    if(res3.status()){
        res3.getRows().forEach(row => {
            console.log(row)
        });
        let values = [
            ['test3'],
            ['test4']
        ]
        let res4 = await conn.query("insert into test(valor) values ?").bind([values]).exec()
        if(res4.status()){
            console.log(res4.getDataSuccess());
        }  
        
        console.log(await conn.query("select count(*) from test where valor = ?").bind(['test4']).exec())
        
    } else {
        console.log(res3.getDataError())
    }

    /**
     * teste de erros de valores duplicados
     */
    
    let emailres = await conn.query("insert into emails(email) values (?)").bind(['test@email.com']).exec()
    
    if(!emailres.status() && emailres.getDataError().code == 'ER_DUP_ENTRY'){
        console.log('email duplicado')
        console.log(emailres)
    }
    
})()