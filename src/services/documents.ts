import { QueryDocFull, data_info} from "../entidades/QueryDoc"
import {mysqli} from "../libs/mysqli"
import Service from "./Service"


const getListDocuments = async (service:Service) => {
    
    let data:data_info|undefined = service.getBody()
    let query = new QueryDocFull(data)
    let resul = await mysqli().query(query.toString()).bind(query.getBind()).exec()
    
    let code  = resul.status() ? 200 : 500
    let body  = resul.getRows()
    let mess  = resul.getDataError().message

    if(code != 200 && resul.getDataError().errno){
        mess = "Dados enviados incorretamente"
    }
    
    return service.response(body, code, mess)

}


const getCategorias = async (service:Service) => {

    let resul = await mysqli().query("SELECT DISTINCT categoria FROM documentos_info").exec()
    let code  = resul.status() ? 200 : 500
    let body  = resul.getRows()
    let mess  = resul.getDataError().message

    return service.response(body, code, mess)

}


const getDoc = async (service:Service) => {

    let doc_id = service.getQuery('doc_id')
    if(!doc_id) return service.response({}, 400, 'Bad Request')
    
    const res  = await mysqli().query("SELECT * FROM documentos_brutos WHERE id = ?").bind([doc_id]).exec()
    const rows = res.getRows()
    const code = rows.length > 0 ? 200 : 404

    return service.response(rows, code, code == 200 ? res.getDataError().message : "Documento não encontrado")

}


export default { getCategorias, getListDocuments, getDoc }