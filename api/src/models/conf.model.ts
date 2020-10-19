/**
 * Interface for server configuration.
 */
export interface ServConf {
    port: string;
}

/**
 * Interface for database config.
 */
export interface DbConf {
    url: string;
    dbName: string;
    dbUser: string;
    dbPassword: string;
}