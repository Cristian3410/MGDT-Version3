
const err = document.getElementById("error")

document.getElementById('registrer-form').addEventListener("submit", async (e)=>{

    (e).preventDefault();

   const usuario = document.getElementById("user").value;
   const contrasena = document.getElementById("password").value;
   const nombresApellidos = document.getElementById("Nym").value;
   const edad = document.getElementById("age").value;
   const correoE = document.getElementById("correo").value;
   const cargoE = document.getElementById("cargo").value;
   const superE = document.getElementById("super").value;
   const res = await fetch("http://localhost:4100/registrer",{
    method:"POST",
    headers: {
        "Content-Type" :'application/json'
     },
     body:JSON.stringify({
        user:usuario,
        password:contrasena,
        Nym: nombresApellidos,
        age:edad,
        correo:correoE,
        cargo:cargoE,
        super:superE
     })
   })  
  if(!res.ok) return err.classList.toggle("escondido",false)
  const resJson = await res.json();
  if(resJson.redirect){
   window.location.href = resJson.redirect
  }
})


