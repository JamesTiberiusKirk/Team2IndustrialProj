import express, {Request, Response, Router} from 'express';

var router = express.Router();

router.post('/', (req: Request, res: Response) => {
    res.send('peepee poopoo')
})

module.exports = router

// export class RegisterRoute {

//     public router;
//     /**
//      * Constructor.
//      */
//     constructor() {
//         this.router = express.Router();
//         this.initRoutes();
//     }

//     initRoutes() {
//         this.router.post('/', (req: Request, res: Response) => {
//             res.send('peepee poopoo')
//         })
//     }

// }
