import { Request, Response } from "express";

interface variaveis {
    body?:object,
    query?:object,
    header?:object
}

interface service_callback {
    (callback:Service):void
}

interface obj_data_request {
    [key:string]:any
}

class Service {

    private resp?:Response
    private body:obj_data_request = {}
    private query:obj_data_request = {}
    private header:obj_data_request = {}

    private constructor(){}

    static async createServiceByRequest(req:Request, res:Response, callback:service_callback){
        
        const service   = new Service()

        let keys_query  = Object.keys(req.query)
        let keys_body   = Object.keys(req.body)
        let keys_header = Object.keys(req.headers)
        let keys_params = Object.keys(req.params)

        for(let k of keys_query){
            if(req.query[k])
                service.query[k] = req.query[k]
        }

        for(let k of keys_body){
            if(req.body[k])
                service.body[k] = req.body[k]
        }

        for(let k of keys_header){
            if(req.headers[k])
                service.header[k] = req.headers[k]
        }

        for(let k of keys_params){
            if(req.params[k])
                service.query[k] = req.params[k]
        }

        service.resp = res

        await callback(service)

    }

    static async createServiceByVars(vars:variaveis, callback:service_callback){
        
        const service      = new Service()
        if(vars.body)
            service.body   = vars.body
        if(vars.query)
            service.query  = vars.query 
        if(vars.header)
            service.header = vars.header

        await callback(service)

    }

    getBody(key:string|undefined=undefined){ 
        if(!key) return this.body
        return this.body[key]
    }

    getHeader(key:string|undefined=undefined){ 
        if(!key) return this.header
        return this.header[key]
    }

    getQuery(key:string|undefined=undefined){ 
        if(!key) return this.query
        return this.query[key]
    }

    response(body?:any, code=200, message=""){
        let res = {code:code, body:body, message:message}
        if(this.resp){
            this.resp.send(res)
        } else {
            return res
        }
    }


}


export default Service