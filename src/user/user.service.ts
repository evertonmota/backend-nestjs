import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";

@Injectable()
export class UserService{

constructor(private readonly prisma: PrismaService){}

    async create( {name, email, password} : CreateUserDTO ){
          return  this.prisma.user.create({
                data: {
                    name,
                    email,
                    password
                },
                
            });
    }

    async list(){
        return this.prisma.user.findMany();
    }

    async findById(id : number){
        return this.prisma.user.findUnique(
            {
                where:
                    {id}
            }
        );
    }

    async update( id : number, {name, email,password, birthAt} : UpdatePutUserDTO){

        if(!(await this.findById(id)) ){
            throw new NotFoundException(`O usuário ${id} nao existe.`); 
        }

        return this.prisma.user.update(
            {
                where :
                    {id},
                    data:{name, email,password, birthAt: birthAt ? new Date(birthAt) : null}
            }
        )
    }

    async updatePartial( id : number,{name, email,password, birthAt}: UpdatePatchUserDTO){

        if(!(await this.findById(id)) ){
            throw new NotFoundException(`O usuário ${id} nao existe.`); 
        }

        const data: any = {};

        if(birthAt){
            data.birthAt = new Date(birthAt);
        }

        if(data.name){
            data.name = name;
        }
        if(data.email){
            data.email = email;
        }

        if(data.password){
            data.password = password;
        }
        return this.prisma.user.update(
            {
                where :
                    {id},
                    data
            }
        );
    }
    async delete( id : number){

        await this.exists(id);
       
        return this.prisma.user.delete(
            {
                where :
                    {id}
            }
        )
    }

    async exists (id: number){
        if(!(await this.findById(id)) ){
            throw new NotFoundException(`O usuário ${id} nao existe.`); 
        }
    }
}