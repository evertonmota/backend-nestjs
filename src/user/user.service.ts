import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService{

constructor(private readonly prisma: PrismaService){}

    async create( data : CreateUserDTO ){

        data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());

          return  this.prisma.user.create({
                    data,
            });
    }

    async list(){
        return this.prisma.user.findMany();
    }

    async findById(id : number){

        await this.exists(id);

        return this.prisma.user.findUnique(
            {
                where:
                    {id}
            }
        );
    }

    async update( id : number, {name, email,password, birthAt, role} : UpdatePutUserDTO){

        await this.exists(id);
        /*if(!(await this.findById(id)) ){
            throw new NotFoundException(`O usuário ${id} nao existe.`); 
        }*/
        password = await bcrypt.hash(password, await bcrypt.genSalt());

        return this.prisma.user.update(
            {
                where :
                    {id},
                    data:{name, email,password, birthAt: birthAt ? new Date(birthAt) : null, role}
            }
        )
    }

    async updatePartial( id : number,{name, email,password, birthAt, role}: UpdatePatchUserDTO){

        if(!(await this.findById(id)) ){
            throw new NotFoundException(`O usuário ${id} nao existe.`); 
        }

        const data: any = {};

        if(birthAt){
            data.birthAt = new Date(birthAt);
        }

        if(name){
            data.name = name;
        }
        if(data.email){
            data.email = email;
        }

        if(password){
            const salt = await bcrypt.genSalt();
           data.password = await bcrypt.hash(password,salt);
        }

        if(role){
            data.role = role;
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
        if(!(await this.prisma.user.count({
            where:
            {id}
        })) ){
            throw new NotFoundException(`O usuário ${id} nao existe.`); 
        }
    }
}