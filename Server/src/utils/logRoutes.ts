import fs from 'fs';
import path from 'path';

/**
 * Questo modulo si occupa di loggare tutte le rotte disponibili nel server.
 * 
 * Per fare ciò, vengono letti i file delle rotte presenti nella cartella `routes` e per ognuno di essi
 * viene estratto lo stack delle rotte e loggato il metodo HTTP e il percorso di ciascuna rotta.
 * 
 */
const routesPath = path.join(__dirname, '../routes');
const routeFiles = fs.readdirSync(routesPath).filter(file => file.endsWith('Routes.ts'));
const routes = routeFiles.map(file => {
  const route = require(path.join(routesPath, file));
  return { name: file.replace('.ts', ''), stack: route.default.stack };
});

/**
 * Logga tutte le rotte disponibili nel server.
 *
 * Questo metodo stampa le rotte principali, le rotte di autenticazione e le rotte delle stanze.
 *
 * - Le rotte principali sono estratte dallo stack del router principale dell'app.
 * - Le rotte di autenticazione sono estratte dallo stack di `authRoutes`.
 * - Le rotte delle stanze sono estratte dallo stack di `roomRoutes`.
 *
 * Per ogni rotta, viene stampato il metodo HTTP (es. GET, POST) e il percorso.
 */
export const logRoutes = () => {
  console.log("Registered rotues:");

  // ? Log le Rotte di Auth
  const logRouteStack = (stack: any, label: string) => {
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    const labelMessage = ` ${capitalizedLabel}s routes:`;
    console.log(labelMessage);
    stack.forEach((r: any) => {
      if (r.route && r.route.methods) {
        Object.keys(r.route.methods).forEach((method) => {
          const type = method.toUpperCase();
          const path = r.route.path;
          console.log(`   - ${type}: ${label}${path}`);
        });
      }
    });
  };

  routes.forEach(route => {
    logRouteStack(route.stack, route.name.replace('Routes', ''));
  });
};