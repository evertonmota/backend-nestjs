import { CanActivate,Injectable, ExecutionContext} from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/role.decorator";
import { Role } from "src/enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate{

    constructor(private readonly reflector: Reflector){}

   async canActivate(context: ExecutionContext ){  
        
        const requeiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
      
        if(!requeiredRoles){
            return true;
        }

        const {user}= context.switchToHttp().getRequest();

        const rolesFilted = requeiredRoles.filter( r => r === user.role);

        return rolesFilted.length > 0; 
    }
}