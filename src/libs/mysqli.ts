/**
 * 
 * @author Andrei Coelho
 * @version 1
 * @description This library makes use of the MySQL library to manage the database and its connections, simplifying query execution
 * 
 */

import { createPool, OkPacket, Pool, PoolConnection } from "mysql";
import util from 'util'

interface data_success  { insertId:number, affectedRows:number, changedRows:number }
interface data_error    { code:string,errno:number, message?:string, state?:string }
interface data_response { data_success:data_success, data_error:data_error }
interface data_pool     { alias?:string, host:string, user:string, pass:string, database:string, port?:number }

/**
 * @class ResponseQuery
 * 
 * Objeto de resposta da consulta com o banco de dados
 * 
 */

abstract class ResponseQuery<T> {

    private statusQ = true

    protected data_response:data_response = {
        data_success:{
            insertId:0,
            affectedRows:0,
            changedRows:0
        },
        data_error:{
            code:'NO_ERROR', 
            errno:0, 
            message:'NO_MESSAGE',
            state:undefined
        }
    }

    protected rows:T[] = []

    constructor(status:boolean){
        this.statusQ = status
    }

    public status() {
        return this.statusQ
    }

    public getDataError():data_error {
        return this.data_response.data_error
    }

    public getDataSuccess():data_success{
        return this.data_response.data_success
    }

    public getRows():T[] {
        return this.rows
    }

}

class ErrorQuery<T> extends ResponseQuery<T> {

    constructor(code:string, errno:number, sqlMessage?:string, sqlState?:string){
        super(false)
        this.data_response.data_error.code    = code 
        this.data_response.data_error.errno   = errno
        this.data_response.data_error.message = sqlMessage
        this.data_response.data_error.state   = sqlState
    }

}

class SuccessQuery<T extends Object> extends ResponseQuery<T> { 

    constructor(res:any){
        super(true)
        if (this.isOkPacket(res)){
            this.data_response.data_success.insertId     = res.insertId
            this.data_response.data_success.affectedRows = res.affectedRows
            this.data_response.data_success.changedRows  = res.changedRows
        } else {
            if(Array.isArray(res)){
                for(let r of res)
                    this.rows.push(r)
            } else {
                this.rows.push(res)
            }
                
        }
    }

    private isOkPacket(res:any):res is OkPacket{
        return "insertId" in res
    }

}

/**
 * @class MySQLi
 * 
 * class that manages the database and its connections and executes queries
 * 
 */

class MySQLi {
    
    private querystr:string|undefined
    private binds:any[] = []
    private aliasConn:string|undefined

    private static pools:{[key:string]:Pool}[] = []
    private connection:PoolConnection|undefined

    constructor(database?:string){
        this.aliasConn = database
    }

    static addPool(dbObject:data_pool){
        
        let alias = !dbObject.alias ? dbObject.database : dbObject.alias
        let obj:{[key:string]:Pool} = {}
        
        obj[alias] = createPool({
            host:dbObject.host,
            user:dbObject.user,
            password:dbObject.pass,
            port:dbObject.port ? dbObject.port : 3306,
            database:dbObject.database
        })

        MySQLi.pools.push(obj)
    }

    query(query:string){
        this.querystr = query
        return this
    }

    use(aliasConn:string){
        this.aliasConn = aliasConn
        return this
    } 

    async exec<T extends Object>():Promise<ResponseQuery<T>> {

        if(MySQLi.pools.length == 0){
            return new ErrorQuery('NO_COONECTION_ERR', 0, '')
        }

        let aliasConn = this.aliasConn ? this.aliasConn : Object.keys(MySQLi.pools[0])[0]

        const conn = await this.getConnection(aliasConn)
        if(conn == undefined) return new ErrorQuery('NO_COONECTION_ERR', 0, '')

        return new Promise((resolve) => {
            try {
                if(!this.querystr) return resolve(new ErrorQuery('NO_QUERY_ERROR', 0, ''))
                conn.query(this.querystr, this.binds, (err,res) => {
                    if(err) return resolve(new ErrorQuery(err.code,err.errno,err.sqlMessage,err.sqlState))
                    return resolve(new SuccessQuery(res))
                })
            } catch(e) {
                return resolve(new ErrorQuery('EXCEPTION_ERR', 0, "Ocorreu um erro de excessão em 'exec'"))
            }
        })
            
    }

    bind(values:any[]){
        this.binds = values
        return this
    }

    private async getConnection(aliasConn:string):Promise<PoolConnection|undefined>{
        
        if(this.connection != undefined){
            return this.connection
        }

        let pool:Pool|undefined

        for(let poolst of MySQLi.pools){
            if(Object.keys(poolst)[0] == aliasConn){
                pool = poolst[aliasConn]
                break
            }
        }
        if(pool != undefined){
            const getConnectionAsync = util.promisify(pool.getConnection).bind(pool);
            this.connection = await getConnectionAsync()
            return this.connection
        }

        return undefined
            
    }

}

const mysqli  = (query?:string)      => new MySQLi(query)
const addPool = (dataPool:data_pool) => MySQLi.addPool(dataPool)

export { mysqli, addPool }

