import { Express, Request, Response } from "express";
import Service from "./services/Service";
import documents from "./services/documents";

export default (app:Express) => {
    app.get('/', (req:Request, res:Response) => res.send("salve!"))
    app.get('/documents', (req:Request, res:Response) => Service.createServiceByRequest(req, res, documents.getListDocuments))
    app.get('/documents/categorias', (req:Request, res:Response) => Service.createServiceByRequest(req, res, documents.getCategorias))
    app.get('/document', (req:Request, res:Response) => Service.createServiceByRequest(req, res, documents.getDoc))
}