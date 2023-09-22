
const express = require("express"); //requiriendo la libreria express
const cookieparser = require("cookie-parser");
const app =  express(); //iniciando la librearia express y guardandola en la constante app
const connection = require("../BaseDeDatos/BaseDeDatos")
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");



app.listen(4100,(req,res)=>{    
    console.log("escuchando en el puerto 4100")
});

//midelwars
app.use(express.static(__dirname + "/publico"));
app.use(express.json());
app.use(cookieparser());



app.get("/",soloPublico,(req,res) => res.sendFile( __dirname + "/paginas/logueo.html")) 
app.get("/registro",soloPublico,(req,res) => res.sendFile(__dirname + "/paginas/registro.html")) 
app.get("/administrador",soloAdmin,(req,res)=>res.sendFile(__dirname + '/paginas/administrador/administrador.html'))


app.post("/registrer", (req,res)=>{
    const Idjs = req.body.user  
    const pasJs = req.body.password
    const NyAjs = req.body.Nym
    const edadjs = req.body.age
    const correojs = req.body.correo
    const cargojs = req.body.cargo
    const superjs = req.body.super
    if(!Idjs || !pasJs || !NyAjs || !edadjs || !correojs || !cargojs || !superjs){
       return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
    }
    let buscar = "SELECT * FROM Usuarios WHERE idUsuario = ?";
    connection.query(buscar,[Idjs],async(error,result)=>{
      if(error){
          return res.status(500).send({status:"Error",message:"error en la consulta SQL"})
        }else{
           if(result.length>0){
              return res.status(400).send({status:"Error",message:"no se puede registrar porque ya hay un usuario con sus mismos datos"})
            }else{
               const salt = await bcryptjs.genSalt(5);
               const hashPassword = await bcryptjs.hash(pasJs,salt)
               connection.query('INSERT INTO Usuarios SET ?',{idUsuario:Idjs,Contrasena:hashPassword,nombresYapellidos:NyAjs,Edad:edadjs,correoCorporativo:correojs,Cargo:cargojs,supervisorEncargado:superjs}, (error,result) =>{
                    if(error){
                       return res.status(500).send({status:"Error",message:"error en la consulta SQL"})
                    }else{
                    nuevoUsuario ={Idjs,pasJs}
                  console.log(nuevoUsuario);
                     return res.status(201).send({status:"ok",message:`usuario ${nuevoUsuario.Idjs}agregado`,redirect:"/"})
                  }
               })
            }
    }
    })
 }
)

app.post("/loguin",(req,res)=>{
    const Idjs = req.body.user  
    const pasJs = req.body.password
    if(!Idjs || !pasJs){
        return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
    }
    let buscar = "SELECT * FROM Usuarios WHERE idUsuario = ?";
    connection.query(buscar,[Idjs],async(error,result)=>{
        if(error){
            console.log(error)
        }else{
          if(!result.length>0){
            return res.status(400).send({status:"Error",message:"error al ingresar usuario"})
          }else{
            const passhash = result[0].Contrasena
            const comparador = await bcryptjs.compare(pasJs,passhash)
            if(!comparador){
              return res.status(400).send({status:"Error",message:"error al ingresar usuario"})
            }else{
                const token = jsonwebtoken.sign(
                    {user:Idjs},
                    process.env.JWT_SECRET,
                    {expiresIn:process.env.JWT_EXPIRATION});
                    const cookieOption = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000,),
                        path: "/"
                    }
                    res.cookie("jwt",token,cookieOption);
                    res.send({status:"ok",message:"usuario loggeado",redirect:"/administrador"})
            }
          }
        }
    })
})



function soloAdmin(req,res,next){
   revisarCookie(req,(logueado)=>{
    if(logueado){
        return next();
    }else{
        return res.redirect("/")
    }
   })
}

function soloPublico(req,res,next){
    
 revisarCookie(req,(logueado)=>{
        if(!logueado){
            return next();
        }else{
            return res.redirect("/administrador")
        }
       })
}



function revisarCookie(req,callback){
    try{
const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
   const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET)
   console.log(decodificada)
   const buscarUsuario = "SELECT * FROM Usuarios WHERE idUsuario = ?";
   connection.query(buscarUsuario,[decodificada.user], (error,result)=>{
    if(error){
         console.error(error)
         callback(false)
        
    }else{
        if(result.length >0){
            callback(true);
        }else{
            callback(false);
        }
       
    }
    
}
)
}
catch{
    callback(false)
}
}








