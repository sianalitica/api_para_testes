
const map_fields:{[key:string]:string} = {
    documento_id:"documentos_brutos.id",
    id:"documento_info.id",
    categoria:"documentos_info.categoria",
    tipo:"documentos_info.tipo",
    especie:"documentos_info.especie",
    data_ref:"documentos_info.data_referencia",
    data_ent:"documentos_info.data_entrega",
    status:"documentos_info.status",
    v:"documentos_info.v",
    modalidade:"documentos_info.modalidade",
    texto:"documentos_brutos.texto",
    ext:"documentos_brutos.ext"
}

interface order_by {
    field:string,
    order:string         // desc | asc
}

interface limit {
    page:number,
    rows:number
}

interface data_info {
    fields?:string[],
    limit?:limit,
    orderBy?:order_by,
    text_like?:string,
    regex?:string,
    categoria?:string,
    tipo?:string,
    data_ref?:string,     // data referencia
    data_ref_max?:string, // data máxima de referencia
    data_ref_min?:string, // data mínima de referencia
    data_ent?:string,     // data entrega
    data_ent_max?:string, // data máxima de entrega
    data_ent_min?:string, // data mínima de entrega
    ext?:string
}


class QueryDocFull {

    private queryString = ""
    private where = ""
    private binds:any[] = []

    constructor(queryObj?:data_info){

        this.queryString += "SELECT "
        let asterisco = true
        
        if(queryObj && queryObj.fields && queryObj.fields.length > 0){
            
            for(let f of queryObj.fields){
                asterisco = false
                if(map_fields[f] == undefined){
                    console.log("o campo '"+f+"' não está mapeado em map_fields")
                }
                this.queryString += map_fields[f]+","
            }

            if(!asterisco) this.queryString  = this.queryString.substring(0,this.queryString.length - 1)
        } 

        if(asterisco) this.queryString += " * "

        this.queryString += 
        `   FROM
                documentos_brutos 
            JOIN
                documentos_info ON documentos_info.id = documentos_brutos.documento_info_id `

        if(!queryObj) return;

        if(queryObj.categoria){
            this.init_where()
            this.where += map_fields['categoria']+" = ? AND "
            this.binds.push(queryObj.categoria)
        }

        if(queryObj.text_like){
            this.init_where()
            this.where += map_fields['texto']+" like ? AND "
            this.binds.push(`%${queryObj.text_like}%`)
        }

        if(queryObj.regex){
            this.init_where()
            this.where += map_fields['texto']+" REGEXP ? AND "
            this.binds.push(queryObj.regex)
        }

        if(queryObj.ext){
            this.init_where()
            this.where += map_fields['ext']+" = ? AND "
            this.binds.push(queryObj.ext)
        }

        if(queryObj.tipo){
            this.init_where()
            this.where += map_fields['tipo']+" = ? AND "
            this.binds.push(queryObj.tipo)
        }

        if(queryObj.data_ref){
            this.init_where()
            this.where += map_fields['data_ref']+" = ? AND "
            this.binds.push(queryObj.data_ref)
        }

        if(queryObj.data_ref_min){
            this.init_where()
            this.where += map_fields['data_ref']+" >= ? AND "
            this.binds.push(queryObj.data_ref)
        }

        if(queryObj.data_ref_max){
            this.init_where()
            this.where += map_fields['data_ref']+" <= ? AND "
            this.binds.push(queryObj.data_ref)
        }

        if(queryObj.data_ent){
            this.init_where()
            this.where += map_fields['data_ent']+" = ? AND "
            this.binds.push(queryObj.data_ent)
        }

        if(queryObj.data_ent_min){
            this.init_where()
            this.where += map_fields['data_ent']+" >= ? AND "
            this.binds.push(queryObj.data_ent)
        }

        if(queryObj.data_ent_max){
            this.init_where()
            this.where += map_fields['data_ent']+" <= ? AND "
            this.binds.push(queryObj.data_ent)
        }

        this.where = this.where.substring(0, this.where.length - 4)
        this.queryString += this.where
        
        if(queryObj.orderBy){
            this.queryString += " ORDER BY "+map_fields[queryObj.orderBy.field]+" "+queryObj.orderBy.order 
        }

        if(queryObj.limit){
            let page = queryObj.limit.page - 1
            page = page < 0 ? 0 : page 
            let offset = page * queryObj.limit.rows 
            this.queryString += ` LIMIT ${offset},${queryObj.limit.rows}`
        }


    }

    private init_where(){
        if(this.where == ""){
            this.where = " WHERE "
        }
    }

    toString(){
        return this.queryString
    }

    getBind(){
        return this.binds
    }

}

class QueryDocSimple {

}

export { QueryDocFull, data_info } 