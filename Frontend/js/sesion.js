  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Crear objeto con los valores del formulario
    let formData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      sucursal: document.getElementById("inputGroupSelect01").value,
      puntoVenta: document.getElementById("inputGroupSelect02").value,
    };
  
    // Verificar si el usuario y contraseña están vacíos
    if (!formData.username || !formData.password) {
      alert("Ensure you input a value in both fields!");
      return; // Termina la ejecución de la función si falta algún campo
    }
  
    // Intentar enviar los datos
    try {
      await postJSON(formData);
      alert("This form has been successfully submitted!");
      console.log(`This form has been submitted with:`, formData);
  
      // Limpiar los campos del formulario después de enviar
      document.getElementById("loginForm").reset();
    } catch (error) {
      console.error("Error:", error);
    }
  });
  
  async function postJSON(data) {
    try {
      const response = await fetch("http://localhost:3002/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) throw new Error("Network response was not ok.");
  
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
      throw error; // Propagar el error para manejo externo
    }
  }
  
  