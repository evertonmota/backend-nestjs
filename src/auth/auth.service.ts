import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService{

    constructor(private readonly jwtService: JwtService, 
                private readonly prismaService : PrismaService)
    {}

    async createToken(){
        //return this.jwtService.sign();
    }

    async checkToken(){
        //return this.jwtService.verify();
    }

    async login(email: string, password: string){
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
                password
            }
        });
        if(!user){

            throw new UnauthorizedException('Email e/ou Senha incorretos.');
        }

        return user;
    }


    async forget(email: string){
        const user = await this.prismaService.user.findFirst({
            where: {
                email
            }
        });

        if(!user){

            throw new UnauthorizedException('Email está incorretos.');
        }

        // TODO : Enviar e-mail ...
        return true;
    }
    async reset(password: string, token: string){

        //TODO : Validar o token...
        const id = 0;

        await this.prismaService.user.update({
            where:{
                 id,   
            },
            data: {
                password
            }
        });

        return true;

    }
}