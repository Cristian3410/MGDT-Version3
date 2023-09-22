
document.getElementById("botton").addEventListener("click",()=>{
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
  document.location.href = "/"

})