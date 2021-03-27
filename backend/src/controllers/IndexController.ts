import {Get, JsonController} from 'routing-controllers';

@JsonController()
export default class IndexController {
    @Get('/')
    home(): string {
        console.log('I am the home route');
        return 'Express + TypeScript Server';
    }
}
