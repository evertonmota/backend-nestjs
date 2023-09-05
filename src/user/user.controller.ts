import {Controller, Post, Body, Get, Param, Put, Patch, Delete, ParseIntPipe, UseInterceptors, UseGuards} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/role.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/auth/guards/role.guard";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { ThrottlerGuard } from "@nestjs/throttler";

@Roles(Role.Admin)
@UseGuards(AuthGuard,RoleGuard)
@Controller('users')
@UseInterceptors(LogInterceptor)

export class UserController{

    constructor(private readonly userService : UserService){}

    @UseGuards(ThrottlerGuard)
    @Post()
    async create(@Body() data: CreateUserDTO){
        return this.userService.create(data);
    }
    
    @Get()
    async listAll(){
        return this.userService.list();
    }
    /*
    @Get(':id')
    async show(@Param() params){
        return {user:{}, params}
    }*/

    /*
    @Get(':id')
    async show(@Param('id', ParseIntPipe) id : number ){
        return {user:{}, id}
    }*/
    
    @Get(':id')
    async show(@ParamId() id: number ){
        
        console.log({id});

        await this.userService.exists(id);
        
        return this.userService.findById(id);
    }

    @Put(':id')
    async update(@Body() userPutDTO : UpdatePutUserDTO, @ParamId() id: number ){
        return this.userService.update(id, userPutDTO );
    }
/*
    @Patch(':id')
    async updatePartial(@Body() {name, email, password} : UpdatePatchUserDTO, @Param('id', ParseIntPipe) id : number ){
        return{
            method: 'Patch',
            name, email, password,
            id
        }
    }
*/
/*    @Patch(':id')
    async updatePartial(@Body() {name, email, password} : UpdatePatchUserDTO, @Param('id', ParseIntPipe) id : number ){
        return{
            method: 'Patch',
            name, email, password,
            id
        }
    }
    */

    @Patch(':id')
    async updatePartial(@Body() userDTO : UpdatePatchUserDTO, @ParamId() id: number ){
        return  this.userService.updatePartial(id, userDTO) 
     }

    /*@Delete(':id')
    async delete(@Param() param ){
        return {
            method: 'Delete',
            param
        }
    }*/

    //conversao String para INT
   /* @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id : number ){
        return {
            method: 'Delete',
            id
        }
    } */

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id : number ){
        return this.userService.delete(id);
    }
}