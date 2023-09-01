import { CanActivate,Injectable, ExecutionContext, Inject, forwardRef} from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor( //@Inject(forwardRef( () => AuthService))
                private readonly authService: AuthService, 
                
                private readonly userService: UserService){}

   async canActivate(context: ExecutionContext ){  
        const request = context.switchToHttp().getRequest();
        const {authorization} = request.headers;    
        try {
            const data = this.authService.checkToken((authorization ?? '').split(' ')[1]);
            request.tokenPayLoad = data;
            request.user = await this.userService.findById(data.id);
             return true;
        } catch (error) {
            return false;
        }        
    }
}