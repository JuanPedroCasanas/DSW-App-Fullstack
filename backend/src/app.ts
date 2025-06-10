import 'reflect-metadata'
import express, {Request, Response, NextFunction} from 'express';
import { RequestContext } from '@mikro-orm/core'
import { initORM, getORM, syncSchema } from './orm/db'
import cors from 'cors'
import { Occupation } from './model/entities/Occupation';

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
    RequestContext.create(getORM().em, next);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});



app.post('/addOccupation', async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const occupation = new Occupation(name);
    await getORM().em.persistAndFlush(occupation);
    res.status(201).json({ message: 'Occupation added', occupation });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add occupation' });
  }
});


app.get('/getOccupations', async (req: Request, res: Response) => {
  try {
    const occupations = await getORM().em.find(Occupation, {});
    res.json(occupations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch occupations' });
  }
});



app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
});

async function start() {
  await initORM();
  await syncSchema(); // ⚠️ Don't use this in production
  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  


  console.error('Failed to start app:', err);
});