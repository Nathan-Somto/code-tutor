import express from "express";
import morgan from "morgan";
import cors from "cors";
import { NotFoundError } from "./errors/httpErrors";
import { errorHandler } from "./middleware/error.middleware";
import authRouter from "./modules/auth"

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/api/auth', authRouter);
app.use((req, _res, next) => {
  next(new NotFoundError(`could not match route:${req.url}`))
});
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
function startServer() {
 app.listen(PORT, () =>{
  console.log(`Server is running on http://localhost:${PORT}`);
 })
}
export {startServer};