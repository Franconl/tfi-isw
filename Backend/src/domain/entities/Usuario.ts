
export class Usuario {
    private username: string;
    private password: string;
    private permisos : string;

  
    constructor(username: string, password: string, permisos : string) {
      this.username = username;
      this.password = password;
      this.permisos = permisos;
    }
  
    // Getter para username
    getUsername(): string {
      return this.username;
    }
  
    // Setter para username
    setUsername(username: string): void {
      this.username = username;
    }
  
    // Getter para password
    getPassword(): string {
      return this.password;
    }
  
    // Setter para password
    setPassword(password: string): void {
      this.password = password;
    }
  }
  