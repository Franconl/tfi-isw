import { connect, set} from "mongoose";

const DB_URI = `${process.env.DB_URI}`
set('strictQuery', true);
const dbInit = async () => {
        connect(DB_URI,
        (err) => {
            if (err) {
                console.log('********* ERROR DE CONEXIÓN *******');
            } else {
                console.log('********* CONEXIÓN CORRECTA *******');
            }
        });
}

export default dbInit