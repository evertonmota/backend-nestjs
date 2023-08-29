import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService{

    private issuer = 'login';
    private audience = 'users';
    constructor(private readonly jwtService: JwtService, 
                private readonly prismaService : PrismaService,
                private readonly userService: UserService)
    {}

    createToken(user:User){
        return {
            accesToken : this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email
            },{
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience
            })
        }
    }

    checkToken(token: string){
        try {
            const data =  this.jwtService.verify(token ,{ 
                audience: this.audience,
                issuer: this.issuer
            });
            return data;
        } catch (error) {
            throw new BadRequestException(error); 
        }
    }

    isValidToken(token: string){
        try {
            this.checkToken(token);
            return true
        } catch (e) {
            return false;
        }
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

        return this.createToken(user);
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

        const user = await this.prismaService.user.update({
            where:{
                 id,   
            },
            data: {
                password
            }
        });

        return this.createToken(user);
    }

    async register(data: AuthRegisterDTO){
        
        const user = await this.userService.create(data);

        return this.createToken(user);
    }
}