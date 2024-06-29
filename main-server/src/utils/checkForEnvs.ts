// this file checks the envs 
/* list of envs 
DATABASE_URL
JWT_SECRET
USER
PASS
UPLOADTHING_SECRET
UPLOADTHING_APP_ID
*/
const checkForEnvs = () => {
    const envs = [
        "DATABASE_URL",
        "JWT_SECRET",
        "USER",
        "PASS",
        "UPLOADTHING_SECRET",
        "UPLOADTHING_APP_ID",
    ];
    envs.forEach((env) => {
        if (!process.env[env]) {
            console.error(`Env ${env} is not set`); 
            process.exit(1);
        }
    });
    
}