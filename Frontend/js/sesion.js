  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Crear objeto con los valores del formulario
    let formData = {
      user : document.getElementById("username").value,
      pass : document.getElementById("password").value,
      sucursal : "65c923f5229d4ff6cd26c860",
      puntoDeVenta : "65cb8d06d9fcb1fb2fb0a1ed",
    };
  
    // Verificar si el usuario y contraseña están vacíos
    if (!formData.user || !formData.pass) {
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
      console.log(data)
      const response = await fetch("http://localhost:3002/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
  
  