import { JwtModuleOptions } from './jwt.interface';
export declare class JwtService {
    private readonly options;
    constructor(options: JwtModuleOptions);
    sign(id: number): string;
    verify(token: string): string | object;
}
