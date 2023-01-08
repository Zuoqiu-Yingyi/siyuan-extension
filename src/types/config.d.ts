export interface IConfig {
    server: {
        protocol: string;
        hostname: string;
        port: number;
        token: string;
        url: URL;
    };
}
