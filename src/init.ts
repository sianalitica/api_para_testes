import Config from "./libs/config";
import {addPool} from "./libs/mysqli";
import { Express } from "express";

const config = Config.instance();

(() => {
    const database = config.getDatabase();
    addPool({
        alias:"main",
        host:database.host,
        user:database.user,
        pass:database.pass,
        database:database.name
    })
})()

const startApp = (app:Express) => {
    const json = config.json()
    app.listen(json.port, () => {
        console.log(`API ativa na porta ${json.port}`)
    })
}

export default startApp