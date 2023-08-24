import {Controller, Post, Body, Get, Param, Put, Patch, Delete, ParseIntPipe, UseInterceptors} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";

@Controller('users')
export class UserController{

    constructor(private readonly userService : UserService){}

    @UseInterceptors()
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
    async show(@Param('id', ParseIntPipe) id : number ){
        return this.userService.findById(id);
    }


    @Put(':id')
    async update(@Body() userPutDTO : UpdatePutUserDTO, @Param('id', ParseIntPipe) id : number ){
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
    async updatePartial(@Body() userDTO : UpdatePatchUserDTO, @Param('id', ParseIntPipe) id : number ){
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