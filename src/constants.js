const DOMAIN_DEV = "http://localhost:8080/api"
const DOMAIN_PROD = "https://twitter-backend-fkr0.onrender.com/api"
let DOMAIN = ""

if(import.meta.env.DEV)
{
   DOMAIN = DOMAIN_DEV
}
else
{
    DOMAIN = DOMAIN_PROD
}

export default DOMAIN
