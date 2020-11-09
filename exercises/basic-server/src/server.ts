import bodyParser from "body-parser";
import express, { Request, Response, Router } from "express";

import { Car, cars as cars_list } from "./cars";

(async () => {
  const cars: Car[]  = cars_list;

  // Create an express applicaiton
  const app = express();
  // default port to listen
  const port = 8082;

  // use middleware so post bodies
  // are accessable as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name",
    ( req: Request, res: Response ) => {
      const { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    const { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as
  // an application/json body to {{host}}/persons
  app.post( "/persons",
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Add an endpoint to GET a list of cars. it should be filterable by make with a query paramater
    // > try it {{host}}/cars?make=<make of the car>
  app.get( "/cars/", ( req: Request, res: Response) => {
      const { make } = req.query;

      // tslint:disable-next-line:no-shadowed-variable
      let carsList = cars;

      if (! make ) {
            return res.status(400).send(`Make of the car is required.`);
        }

      if (make) {
          carsList = cars.filter((car) => car.make === make);
      }

      return res.status(200).send(carsList);
  });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get( "/cars/:id", ( req: Request, res: Response) => {
      const { id } = req.params;

      if (!id ) {
          return res.status(400).send(`ID of the car is required.`);
      }

      // try to find the car by id
      // tslint:disable-next-line:no-shadowed-variable
      // @ts-ignore
      // tslint:disable-next-line:no-shadowed-variable
      const car = car.filter((car) => car.id === id);

      // response not found, if we do not have this id
      if (car && car.length === 0) {
          return res.status(404).send(`Car is not found`);
      }

      return res.status(200).send(car);
  });

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  // @ts-ignore

  app.post( "/cars/", ( req: Request, res: Response ) => {
      // destruct our body payload for our variables
      const {make, type, model, cost, id} = req.body;

      // check to make sure all required variables are set
      if (!id || !type || !model || !cost) {
          return res.status(400).send(`make, type, model, cost, id are required`);
      }

      // create a new car instance
      // tslint:disable-next-line:variable-name
      const new_car: Car = {
          // tslint:disable-next-line:object-literal-sort-keys
          make, type, model, cost, id,
      };

      // add this car to our local variable
      cars.push(new_car);

      // send the complete car object as a response along with 201 - creation process
      res.status(201).send(new_car);
  };

  // Start the Server
  app.listen( port, () => {
      // tslint:disable-next-line:no-console
      console.log( `server running http://localhost:${ port }` );
      // tslint:disable-next-line:no-console
      console.log( `press CTRL+C to stop server` );
    } );
})();
