
import {
  http, BaseController, controller
} from '@dazejs/framework';

@controller()
export default class Hello extends BaseController {
  @http.get()
  index() {
    return this.render('hello', {
      name: 'Daze.js'
    });
  }
}