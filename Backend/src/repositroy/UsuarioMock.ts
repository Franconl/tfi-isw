import { Usuario } from "../domain/entities/Usuario";
import { IUsuarioRepository } from "../domain/interfaces/IUsuarioRepository";

export class UsuarioMock implements IUsuarioRepository {
  public authUsuario(criterios: { us: string; pass: string; }): Promise<Usuario | null> {
    
    if (criterios.us === 'pepe' && criterios.pass === '1234') {
      return Promise.resolve(new Usuario('pepe', '1234'));
    } else {
      return Promise.resolve(null); // Devolver nulo si las credenciales no son válidas
    }
  }
}
