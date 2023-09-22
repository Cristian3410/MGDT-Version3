const err = document.getElementById("error")

document.getElementById("loguin-form").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const usuario = document.getElementById("user").value;
    const contrasena = document.getElementById("password").value;
   const res = await fetch('http://localhost:4100/loguin',{
    method:"POST",
    headers:{
        "Content-Type" :'application/json'
    },
    body:JSON.stringify({
        user:usuario,
        password:contrasena,
    })
   });
   if(!res.ok) return err.classList.toggle("escondido",false);
   const resJson = await res.json();
   if(resJson.redirect){
     window.location.href = resJson.redirect;
   }
})